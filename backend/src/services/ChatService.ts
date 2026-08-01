import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatService {
    private static genAI: GoogleGenerativeAI;
    private static model: any;

    static initialize() {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return;
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    static async generateResponse(message: string): Promise<string> {
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
