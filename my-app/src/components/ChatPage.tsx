import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const ChatPage: React.FC = () => {
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

    // Quick message prompts
    const quickMessages = [
        "What do you think about my training schedule?",
        "Can you suggest a workout plan for me?",
        "How can I improve my nutrition?",
        "What are some good recovery tips?",
        "How do I break through a plateau?"
    ];

    // State for showing/hiding quick messages
    const [showQuickMessages, setShowQuickMessages] = useState(true);

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

    const handleQuickMessage = async (msg: string) => {
        setInputMessage(msg);
        setTimeout(() => {
            sendMessage();
        }, 0);
    };

    return (
        <div className="h-screen bg-[#080b14] flex flex-col">
            {/* Header */}
            {/* Header removed as it is replaced by Global Navbar */}

            {/* Chat Container */}
            <div className="flex-1 flex flex-col max-w-[95%] lg:max-w-7xl mx-auto w-full px-2 sm:px-4 pt-4 sm:pt-8 pb-2 sm:pb-4 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm ${message.isUser
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none border border-blue-500/20'
                                    : 'bg-[#1e293b]/80 text-white rounded-bl-none border border-white/10'
                                    }`}
                            >
                                <div className="prose prose-sm prose-invert max-w-none leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                                <p className={`text-[10px] mt-2 text-right font-medium uppercase tracking-wider ${message.isUser ? 'text-blue-200/70' : 'text-gray-400/70'
                                    }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-[#1e293b]/80 text-white rounded-2xl rounded-bl-none px-5 py-4 border border-white/10">
                                <div className="flex space-x-2 items-center h-6">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex-shrink-0 shadow-2xl">
                    {/* Quick Messages Title and Toggle */}
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            Quick Suggestions
                        </span>
                        <button
                            type="button"
                            aria-label={showQuickMessages ? 'Hide quick messages' : 'Show quick messages'}
                            onClick={() => setShowQuickMessages(v => !v)}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${showQuickMessages ? '' : 'rotate-180'}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    {/* Quick Messages */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ${showQuickMessages ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none mb-0'}`}
                    >
                        <div className="flex flex-wrap gap-2">
                            {quickMessages.map((msg, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="px-3 py-1.5 bg-white/5 text-gray-300 border border-white/5 rounded-lg text-[10px] sm:text-xs hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
                                    onClick={() => handleQuickMessage(msg)}
                                    disabled={isLoading}
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-end">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me about training, nutrition, workouts..."
                            className="flex-1 bg-[#0f172a]/50 text-white border border-white/10 rounded-xl px-4 py-3 sm:px-5 sm:py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm sm:text-base placeholder-gray-500 transition-all duration-200"
                            rows={1}
                            style={{ minHeight: '3rem', maxHeight: '8rem' }}
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex-shrink-0"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ChatPage; 