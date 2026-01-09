import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface = () => {
    const { isOpen, closeChat, activeChatUser, messages, sendMessage } = useChat();
    const { user } = useAppContext();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && activeChatUser && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Chat Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-borderColor flex items-center justify-between bg-light">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <img
                                        src={activeChatUser.image || assets.user_profile}
                                        alt="user"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800">{activeChatUser.name}</h3>
                                        {activeChatUser.email === "deekshithm321@gmail.com" && (
                                            <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {activeChatUser.role === 'provider' ? 'Service Provider' : 'Customer'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={closeChat} className="p-2 hover:bg-gray-200 rounded-full">
                                <img src={assets.close_icon} alt="close" className="w-5 h-5 opacity-60" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <p>No messages yet.</p>
                                    <p>Say hello!</p>
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const sender = msg.senderId;
                                const senderIdStr = (sender?._id || sender)?.toString();
                                const isMe = senderIdStr === user?._id;
                                const isAdmin = (typeof sender === 'object' ? sender?.email : null) === "deekshithm321@gmail.com";

                                return (
                                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm relative ${isMe
                                                ? "bg-primary text-white rounded-br-sm"
                                                : isAdmin
                                                    ? "bg-amber-50 border border-amber-200 text-gray-800 rounded-bl-sm ring-1 ring-amber-100"
                                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                                                }`}
                                        >
                                            <p>{msg.text || msg.message}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-gray-400"}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-borderColor bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-borderColor rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 bg-primary text-white rounded-full hover:bg-primary-dull disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <img src={assets.arrow_icon} alt="send" className="w-5 h-5 rotate-180 invert" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatInterface;
