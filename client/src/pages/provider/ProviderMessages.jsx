import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useChat } from '../../context/ChatContext';
import { toast } from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ProviderMessages = () => {
    const { axios, token, user } = useAppContext();
    const { sendMessage, messages, joinRoom, loadMessages, isConnected, socket, unreadCounts } = useChat();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (token) {
            fetchConversations();
        }
    }, [token]);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get('/api/messages/conversations');
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Fetch conversations error:", error);
            toast.error("Failed to load conversations");
        }
    };

    const handleSelectConversation = async (conv) => {
        setSelectedConversation(conv);
        joinRoom(conv._id);
        loadMessages(conv._id);

        try {
            // Mark messages as read
            await axios.put("/api/messages/read", {
                senderId: conv._id,
                receiverId: user._id
            });
            // Note: Context polling will clear the red dot globally in a few seconds.
            // Ideally we'd have a 'markRead' function in context to update state instantly.
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (messageInput.trim() && selectedConversation) {
            sendMessage(messageInput);
            setMessageInput('');
            // Update last message in local list optimistically
            setConversations(prev => prev.map(c =>
                c._id === selectedConversation._id
                    ? { ...c, lastMessage: messageInput, updatedAt: new Date() }
                    : c
            ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedConversation]);

    // Listen for incoming messages to update conversation list lastMessage
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            setConversations(prev => {
                const updated = prev.map(c =>
                    c._id === msg.conversationId || c._id === msg.room // room is conservationId
                        ? { ...c, lastMessage: msg.content, updatedAt: new Date() }
                        : c
                );
                return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    return (
        <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Conversation List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-lg">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No conversations yet</div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv._id}
                                onClick={() => handleSelectConversation(conv)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?._id === conv._id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-gray-900">{conv.userId?.name || 'User'}</h3>
                                        {conv.userId?.email === "deekshithm321@gmail.com" && (
                                            <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(conv.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-blue-600 mb-1">{conv.serviceId?.title}</p>
                                    {unreadCounts[conv._id] > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                            {unreadCounts[conv._id]}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden text-gray-500"
                                >
                                    &larr;
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{selectedConversation.userId?.name}</h3>
                                        {selectedConversation.userId?.email === "deekshithm321@gmail.com" && (
                                            <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{selectedConversation.serviceId?.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg, index) => {
                                const senderIdStr = (msg.senderId?._id || msg.senderId)?.toString();
                                return (
                                    <div key={index} className={`mb-3 flex ${senderIdStr === user?._id ? 'justify-end' : 'justify-start'}`}>
                                        {/* Note: msg.senderId comparison needs real user ID not token. 
                                        Since we don't have user ID in context easily without parsing token again or storing it:
                                        We can trust 'sender' field if added, currently we use senderId.
                                        Let's fix this by using `useAppContext` user object if available.
                                    */}
                                        <MessageBubble msg={msg} />
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!messageInput.trim()}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

const MessageBubble = ({ msg }) => {
    const { user } = useAppContext();
    const sender = msg.senderId;
    const senderIdStr = (sender?._id || sender)?.toString();
    const isMe = senderIdStr === user?._id;
    const isAdmin = (typeof sender === 'object' ? sender?.email : null) === "deekshithm321@gmail.com";

    return (
        <div className={`max-w-[70%] p-3 rounded-lg relative ${isMe
            ? 'bg-blue-600 text-white rounded-br-none'
            : isAdmin
                ? 'bg-amber-50 border border-amber-200 text-gray-800 rounded-bl-none ring-1 ring-amber-100'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
            <p className="text-sm">{msg.text || msg.content}</p>
            <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export default ProviderMessages;
