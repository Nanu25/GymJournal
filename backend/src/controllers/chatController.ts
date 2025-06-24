import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatController {
    private static genAI: GoogleGenerativeAI | null = null;

    static initialize() {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error('ChatController: GEMINI_API_KEY is not set in environment variables');
            console.error('ChatController: Please add GEMINI_API_KEY=your_api_key_here to your .env file');
            return;
        }
        
        if (apiKey.length < 10) {
            console.error('ChatController: GEMINI_API_KEY appears to be too short or invalid');
            return;
        }
        
        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
        } catch (error) {
            console.error('ChatController: Failed to initialize Gemini AI:', error);
            this.genAI = null;
        }
    }

    static async chat(req: Request, res: Response): Promise<void> {
        try {

            // Fallback initialization if not already initialized
            if (!this.genAI) {
                this.initialize();
                if (!this.genAI) {
                    console.error('ChatController: Failed to initialize Gemini AI');
                    res.status(500).json({ error: 'Chat service is not properly configured. Please check GEMINI_API_KEY environment variable.' });
                    return;
                }
            }
            
            const { message } = req.body;

            if (!message || typeof message !== 'string') {
                console.log('ChatController: Invalid message format', { message });
                res.status(400).json({ error: 'Message is required and must be a string' });
                return;
            }


            const systemPrompt = `You are FitCoach AI, an expert fitness and nutrition assistant with deep knowledge of exercise science, sports nutrition, and behavioral psychology.

            CORE EXPERTISE:
            • Exercise Programming: Create periodized workout plans based on goals, experience level, available equipment, and time constraints
            • Nutrition Science: Provide evidence-based dietary guidance including macronutrient optimization, meal timing, and supplement recommendations
            • Movement Quality: Analyze and improve exercise form, mobility, and movement patterns
            • Recovery Optimization: Sleep, stress management, active recovery, and injury prevention protocols
            • Behavior Change: Motivation strategies, habit formation, and sustainable lifestyle modifications
            
            RESPONSE GUIDELINES:
            • Always ask clarifying questions when context is missing (current fitness level, goals, equipment, time availability, dietary restrictions)
            • Provide specific, actionable recommendations with clear progression paths
            • Include relevant scientific rationale when appropriate
            • Structure responses with clear headings and bullet points for complex topics
            • Offer modifications for different fitness levels and physical limitations
            • Reference rep ranges, sets, weights, or time durations when relevant
            
            SAFETY PROTOCOLS:
            • For pain, injuries, or medical conditions: Always recommend consulting qualified healthcare professionals
            • Emphasize proper form over intensity
            • Suggest gradual progression and listening to one's body
            • Flag potentially dangerous exercises or approaches
            
            TONE: Professional yet encouraging, like a knowledgeable coach who genuinely cares about the user's success.
            
            When uncertain about specific medical or advanced topics, acknowledge limitations and suggest consulting relevant professionals (registered dietitians, physical therapists, sports medicine doctors).`;
            
            const model = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

  
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            res.json({ response: text });
        } catch (error) {
            console.error('ChatController: Error processing chat request:', error);
            console.error('ChatController: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            
            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('API_KEY')) {
                    res.status(500).json({ 
                        error: 'Invalid API key. Please check your GEMINI_API_KEY configuration.',
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

// Initialize the chat controller when the module is loaded
ChatController.initialize(); 