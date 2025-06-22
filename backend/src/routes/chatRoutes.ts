import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        console.log('Inline chat handler: Processing message:', message.substring(0, 50) + '...');

        // Create Gemini AI instance directly
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Create a fitness-focused system prompt
        const systemPrompt = `You are an expert fitness and nutrition AI assistant. You help users with:
        - Training advice and workout plans
        - Nutrition guidance and meal planning
        - Exercise form and technique
        - Recovery and injury prevention
        - Fitness motivation and goal setting
        - General health and wellness questions

        Always provide practical, safe, and evidence-based advice. If someone asks about medical conditions or injuries, recommend consulting with healthcare professionals. Keep responses helpful, encouraging, and focused on fitness and health topics.`;

        const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

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