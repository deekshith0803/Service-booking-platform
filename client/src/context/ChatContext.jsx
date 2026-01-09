import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { axios, user } = useAppContext();
    const [messages, setMessages] = useState({}); // { providerId: [messages] }
    const [unreadCounts, setUnreadCounts] = useState({}); // { providerId: count }
    // Socket connection
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null); // The user/provider we are chatting with

    // Socket Initialization
    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", {
                withCredentials: true
            });

            newSocket.on("connect", () => {
                setIsConnected(true);
                // Join personal room for notifications if needed
                newSocket.emit("join_room", user._id);
            });

            newSocket.on("disconnect", () => setIsConnected(false));

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user]);

    // Poll for unread messages
    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            try {
                const { data } = await axios.get(`/api/messages/unread/${user._id}`);
                if (data.success) {
                    setUnreadCounts(data.counts);
                }
            } catch (error) {
                console.error("Failed to fetch unread counts", error);
            }
        }
        fetchUnread();
        const interval = setInterval(fetchUnread, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [user, axios]);

    // Poll active chat messages
    useEffect(() => {
        if (!user || !activeChatUser) return;

        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`/api/messages/${activeChatUser._id}?currentUserId=${user._id}`);
                if (data.success) {
                    // Update messages for this specific user
                    setMessages(prev => ({
                        ...prev,
                        [activeChatUser._id]: data.messages
                    }));

                    // If we are looking at the chat, mark as read
                    if (isOpen) {
                        await axios.put("/api/messages/read", {
                            senderId: activeChatUser._id,
                            receiverId: user._id
                        });
                        // Optimistically update unread count
                        setUnreadCounts(prev => ({ ...prev, [activeChatUser._id]: 0 }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll faster for active chat

        return () => clearInterval(interval);
    }, [user, activeChatUser, isOpen, axios]);


    const joinRoom = (roomId) => {
        if (socket && isConnected) {
            socket.emit("join_room", roomId);
        }
    };

    const loadMessages = (otherUserId) => {
        setActiveChatUser({ _id: otherUserId }); // minimal user object to trigger poll
    };

    const openChat = (otherUser) => {
        setActiveChatUser(otherUser);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setActiveChatUser(null);
    };

    const sendMessage = async (text) => {

        // OPTIONAL: Emit via socket for real-time (not strictly needed since we poll, but better for UI)
        // For now relying on HTTP POST as per original implementation
        if (!activeChatUser || !text.trim()) return;

        try {
            const { data } = await axios.post("/api/messages/send", {
                senderId: user._id,
                receiverId: activeChatUser._id,
                message: text,
            });

            if (data.success) {
                // Optimistically add message
                setMessages(prev => ({
                    ...prev,
                    [activeChatUser._id]: [...(prev[activeChatUser._id] || []), data.data]
                }));
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const value = {
        isOpen,
        openChat,
        closeChat,
        activeChatUser,
        messages: activeChatUser ? (messages[activeChatUser._id] || []) : [],
        sendMessage,
        unreadCounts,
        joinRoom, // Exposed now
        loadMessages, // Exposed now, helper to switch active chat
        socket,
        isConnected
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    return useContext(ChatContext);
};
