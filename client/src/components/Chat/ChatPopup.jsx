import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAppContext } from '../../context/AppContext';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'; // Adjust based on installed heroicons version

const ChatPopup = () => {
    const { socket, isConnected, messages, sendMessage, isOpen, toggleChat, activeConversationId } = useChat();
    const { token, user } = useAppContext();
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (messageInput.trim() && activeConversationId) {
            sendMessage(activeConversationId, messageInput);
            setMessageInput('');
        }
    };

    if (!isConnected) {
        // Optional: Don't render if not connected/authenticated
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col mb-4 border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                        <h3 className="font-semibold">Chat Support</h3>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => {
                            const sender = msg.senderId;
                            const senderIdStr = (sender?._id || sender)?.toString();
                            const isMe = msg.sender === 'me' || senderIdStr === user?._id;
                            const isAdmin = (typeof sender === 'object' ? sender?.email : null) === "deekshithm321@gmail.com";

                            return (
                                <div key={index} className={`mb-2 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-2 rounded-lg text-sm relative ${isMe
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : isAdmin
                                            ? 'bg-amber-50 border border-amber-200 text-gray-800 rounded-bl-none ring-1 ring-amber-100'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                        }`}>
                                        <p>{msg.content || msg.text}</p>
                                        <span className="text-[10px] opacity-75 block mt-1 text-right">
                                            {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center float-right"
            >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default ChatPopup;
