import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Training } from '../entities/Training';

const router = express.Router();

// Test endpoint to check chat service status
router.get('/chat/status', authenticateToken, (_req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    res.json({ 
        status: hasApiKey ? 'configured' : 'not_configured',
        hasApiKey,
        message: hasApiKey ? 'Chat service is ready' : 'GEMINI_API_KEY not found in environment variables'
    });
});

// Simple inline chat handler to bypass the static class issue
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        console.log('Inline chat handler: Received chat request');
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            console.log('Inline chat handler: Invalid message format', { message });
            res.status(400).json({ error: 'Message is required and must be a string' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('Inline chat handler: GEMINI_API_KEY not found');
            res.status(500).json({ error: 'Chat service is not properly configured. Please check GEMINI_API_KEY environment variable.' });
            return;
        }

        // Fetch user metrics
        let userMetrics = null;
        let lastTrainings: any[] = [];
        const userId = req.user?.id;
        if (userId) {
            try {
                const userRepository = AppDataSource.getRepository(User);
                const trainingRepository = AppDataSource.getRepository(Training);
                userMetrics = await userRepository.findOne({ where: { id: userId } });
                lastTrainings = await trainingRepository.find({
                    where: { userId },
                    order: { date: 'DESC' },
                    take: 30
                });
            } catch (err) {
                console.error('Error fetching user data for chat prompt:', err);
            }
        }
        console.log('Fetched userMetrics:', userMetrics);
        console.log('Fetched lastTrainings:', lastTrainings);

        // Format user metrics for prompt
        let userMetricsText = '';
        if (userMetrics) {
            userMetricsText = `User Metrics:\n` +
                `- Name: ${userMetrics.name}\n` +
                `- Email: ${userMetrics.email}\n` +
                `- Weight: ${userMetrics.weight ?? 'N/A'}\n` +
                `- Height: ${userMetrics.height ?? 'N/A'}\n` +
                `- Gender: ${userMetrics.gender ?? 'N/A'}\n` +
                `- Age: ${userMetrics.age ?? 'N/A'}\n` +
                `- Times Per Week: ${userMetrics.timesPerWeek ?? 'N/A'}\n` +
                `- Time Per Session: ${userMetrics.timePerSession ?? 'N/A'}\n` +
                `- Rep Range: ${userMetrics.repRange ?? 'N/A'}\n`;
        }
        console.log('userMetricsText:', userMetricsText);

        // Format last 30 trainings for prompt
        let trainingsText = '';
        if (lastTrainings.length > 0) {
            trainingsText = `Last 30 Trainings (most recent first):\n` +
                lastTrainings.map(t => {
                    const date = t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date;
                    const exercises = t.exercises ? Object.entries(t.exercises).map(([ex, wt]) => `${ex}: ${wt}`).join(', ') : 'No exercises';
                    return `- Date: ${date} | ${exercises}`;
                }).join('\n');
        }
        console.log('trainingsText:', trainingsText);

        // Append user data to the prompt
        let extraInfo = '';
        if (userMetricsText || trainingsText) {
            extraInfo = `\n\n---\nUSER PROFILE & TRAINING HISTORY (for context):\nBelow is the user's actual training data. Use this information to answer questions about their training schedule, progress, or fitness.\nIf the user's training history is provided below, use it as their training schedule. Do not ask for a schedule if you already have this data. Only ask for more information if something is missing or unclear.\n` + userMetricsText + '\n' + (lastTrainings.length > 0 ? 'The following is the user\'s actual training schedule, as recorded in their last 30 training sessions:\n' + trainingsText : trainingsText);
        }
        console.log('extraInfo:', extraInfo);

        // Keep the original system prompt, but soften the 'always ask' language
        const systemPrompt = `You are an expert fitness and nutrition AI assistant. You help users with:\n\n- Training advice and workout plans\n- Nutrition science and meal planning\n- Exercise form and technique\n- Recovery and injury prevention\n- Motivation and behavior change\n- General health and wellness questions\n\nCORE EXPERTISE:\n• Exercise Programming: Create periodized workout plans based on goals, experience level, available equipment, and time constraints\n• Nutrition Science: Provide evidence-based dietary guidance including macronutrient optimization, meal timing, and supplement recommendations\n• Movement Quality: Analyze and improve exercise form, mobility, and movement patterns\n• Recovery Optimization: Sleep, stress management, active recovery, and injury prevention protocols\n• Behavior Change: Motivation strategies, habit formation, and sustainable lifestyle modifications\n\nRESPONSE GUIDELINES:\n• If context is missing, ask clarifying questions. If the user's training history and metrics are provided, use them to answer questions.\n• Provide specific, actionable recommendations with clear progression paths\n• Include relevant scientific rationale when appropriate\n• Structure responses with clear headings and bullet points for complex topics\n• Offer modifications for different fitness levels and physical limitations\n• Reference rep ranges, sets, weights, or time durations when relevant\n\nSAFETY PROTOCOLS:\n• For pain, injuries, or medical conditions: Always recommend consulting qualified healthcare professionals\n• Emphasize proper form over intensity\n• Suggest gradual progression and listening to one's body\n• Flag potentially dangerous exercises or approaches\n\nTONE: Professional yet encouraging, like a knowledgeable coach who genuinely cares about the user's success.\n\nWhen uncertain about specific medical or advanced topics, acknowledge limitations and suggest consulting relevant professionals (registered dietitians, physical therapists, sports medicine doctors).`;

        const prompt = `${systemPrompt}${extraInfo}\n\nUser: ${message}\n\nAssistant:`;



        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log('Inline chat handler: Sending request to Gemini API...');
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log('Inline chat handler: Received response from Gemini API');
        res.json({ response: text });
    } catch (error) {
        console.error('Inline chat handler: Error processing chat request:', error);
        res.status(500).json({ 
            error: 'Failed to process chat request',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 