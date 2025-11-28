import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export class ChatController {
    static chat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            throw new AppError('Message is required and must be a string', 400);
        }

        try {
            const responseText = await ChatService.generateResponse(message);
            res.json({ response: responseText });
        } catch (error) {
            console.error('ChatController: Error processing chat request:', error);

            if (error instanceof Error) {
                if (error.message.includes('API_KEY') || error.message.includes('configured')) {
                    throw new AppError(`Chat service configuration error. ${error.message}`, 500);
                } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
                    throw new AppError(`API rate limit exceeded. Please try again later. ${error.message}`, 429);
                } else {
                    throw new AppError(`Failed to process chat request: ${error.message}`, 500);
                }
            } else {
                throw new AppError('Failed to process chat request: Unknown error occurred', 500);
            }
        }
    });
}