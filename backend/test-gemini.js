const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv/config');

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        console.log('API Key present:', !!process.env.GEMINI_API_KEY);
        console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
        
        if (!process.env.GEMINI_API_KEY) {
            console.error('No GEMINI_API_KEY found in environment variables');
            return;
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        console.log('Sending test request to Gemini...');
        const result = await model.generateContent("Hello, can you respond with just 'Test successful'?");
        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini response:', text);
        console.log('Test successful!');
        
    } catch (error) {
        console.error('Gemini test failed:', error);
        console.error('Error details:', error.message);
    }
}

testGemini(); 