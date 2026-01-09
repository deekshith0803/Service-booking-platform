import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAppContext } from './AppContext';
import { toast } from "react-hot-toast";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { token, axios } = useAppContext();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState(null);

    useEffect(() => {
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token },
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
        });

        newSocket.on('connect_error', (err) => {
            console.error("Socket connection error:", err.message);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
        });

        newSocket.on('receive_message', (message) => {
            // Only append if it belongs to the active conversation
            setMessages((prev) => {
                // You might want to check message.conversationId === activeConversationId here
                // But simply appending for now if we assume one active chat window logic
                return [...prev, message];
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token]);

    const startChat = async (serviceId, providerId) => {
        try {
            const { data } = await axios.post('/api/chat/start', { serviceId, providerId });
            if (data.success) {
                const conversationId = data.conversation._id;
                setActiveConversationId(conversationId);
                // Join the socket room
                joinRoom(conversationId);
                // Load messages
                loadMessages(conversationId);
                setIsOpen(true);
                return conversationId;
            }
        } catch (error) {
            console.error("Start chat error:", error);
            toast.error("Failed to start chat");
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const { data } = await axios.get(`/api/chat/${conversationId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Load messages error:", error);
        }
    };

    const sendMessage = (room, content) => {
        if (socket && isConnected) {
            const messageData = {
                room,
                content,
                timestamp: new Date().toISOString()
            };
            socket.emit('send_message', messageData);
            // Optimistic update handled by socket listener or manually here?
            // Since server emits back to sender, we can wait for that or do optimistic
            // Let's rely on server echo for now to ensure ID consistency as per server implementation
        }
    };

    const joinRoom = (room) => {
        if (socket && isConnected) {
            socket.emit('join_room', room);
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <ChatContext.Provider value={{
            socket,
            isConnected,
            messages,
            sendMessage,
            joinRoom,
            isOpen,
            toggleChat,
            startChat,
            loadMessages,
            activeConversationId,
            setActiveConversationId,
            setIsOpen
        }}>
            {children}
        </ChatContext.Provider>
    );
};
