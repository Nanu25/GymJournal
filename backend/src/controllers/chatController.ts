import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

export class ChatController {
    static async chat(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body;

            if (!message || typeof message !== 'string') {
                res.status(400).json({ error: 'Message is required and must be a string' });
                return;
            }

            const responseText = await ChatService.generateResponse(message);
            res.json({ response: responseText });
        } catch (error) {
            console.error('ChatController: Error processing chat request:', error);

            if (error instanceof Error) {
                if (error.message.includes('API_KEY') || error.message.includes('configured')) {
                    res.status(500).json({
                        error: 'Chat service configuration error.',
                        details: error.message
                    });
                } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
                    res.status(429).json({
                        error: 'API rate limit exceeded. Please try again later.',
                        details: error.message
                    });
                } else {
                    res.status(500).json({
                        error: 'Failed to process chat request',
                        details: error.message
                    });
                }
            } else {
                res.status(500).json({
                    error: 'Failed to process chat request',
                    details: 'Unknown error occurred'
                });
            }
        }
    }
}