"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatService_1 = require("../services/ChatService");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
class ChatController {
}
exports.ChatController = ChatController;
_a = ChatController;
ChatController.chat = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        throw new AppError_1.AppError('Message is required and must be a string', 400);
    }
    try {
        const responseText = await ChatService_1.ChatService.generateResponse(message);
        res.json({ response: responseText });
    }
    catch (error) {
        console.error('ChatController: Error processing chat request:', error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY') || error.message.includes('configured')) {
                throw new AppError_1.AppError(`Chat service configuration error. ${error.message}`, 500);
            }
            else if (error.message.includes('quota') || error.message.includes('rate limit')) {
                throw new AppError_1.AppError(`API rate limit exceeded. Please try again later. ${error.message}`, 429);
            }
            else {
                throw new AppError_1.AppError(`Failed to process chat request: ${error.message}`, 500);
            }
        }
        else {
            throw new AppError_1.AppError('Failed to process chat request: Unknown error occurred', 500);
        }
    }
});
//# sourceMappingURL=chatController.js.map