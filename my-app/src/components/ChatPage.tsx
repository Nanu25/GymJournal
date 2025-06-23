"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface ChatPageProps {
    onBackToDashboard: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBackToDashboard }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm your AI fitness assistant. I can help you with training advice, nutrition tips, workout plans, and answer any fitness-related questions. What would you like to know?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Authentication error. Please log in again.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: inputMessage
                })
            });

            if (!response.ok) {
                throw new Error("Failed to get response from AI");
            }

            const data = await response.json();
            
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-screen bg-[#080b14] flex flex-col">
            {/* Header */}
            <header className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-b border-blue-500/10 flex-shrink-0">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={onBackToDashboard}
                                className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="hidden sm:inline">Back to Dashboard</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                            <h1 className="text-lg sm:text-2xl font-bold text-white">AI Fitness Assistant</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                                    message.isUser
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-700 text-white'
                                }`}
                            >
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                                <p className={`text-xs mt-1 text-right ${
                                    message.isUser ? 'text-indigo-200' : 'text-gray-400'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-700 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-[#0f172a]/50 backdrop-blur-xl border border-teal-500/10 rounded-lg p-3 sm:p-4 flex-shrink-0">
                    <div className="flex space-x-2 sm:space-x-4">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me about training, nutrition, workouts, or any fitness-related questions..."
                            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                            rows={2}
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-3 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage; 