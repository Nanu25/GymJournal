import { useState } from 'react';
import { API_BASE_URL } from '../config';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export const useChat = () => {
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

    const sendMessage = async (content?: string) => {
        const messageText = content || inputMessage;
        if (!messageText.trim() || isLoading) return;

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
            text: messageText,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            // Use API_BASE_URL if available, otherwise fallback to relative path which might be proxied
            const url = API_BASE_URL ? `${API_BASE_URL}/chat` : '/api/chat';

            // Get last 4 messages for context
            const history = messages.slice(-4).map(msg => ({
                role: msg.isUser ? 'user' : 'model',
                content: msg.text
            }));

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: messageText,
                    history: history
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

    return {
        messages,
        inputMessage,
        setInputMessage,
        isLoading,
        sendMessage
    };
};
