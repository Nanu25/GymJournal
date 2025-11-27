"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class ChatService {
    static initialize() {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return;
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    static async generateResponse(message) {
        if (!this.model) {
            this.initialize();
            if (!this.model) {
                throw new Error('Gemini AI not initialized');
            }
        }
        const systemPrompt = `You are a helpful fitness assistant. 
        Your goal is to help users with their workouts, nutrition, and general fitness questions.
        Keep your answers concise and motivating.`;
        const result = await this.model.generateContent([systemPrompt, message]);
        const response = await result.response;
        return response.text();
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=ChatService.js.map