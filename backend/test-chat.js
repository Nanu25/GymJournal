const fetch = require('node-fetch');

async function testChat() {
    try {
        console.log('Testing chat endpoint...');
        
        // First, let's test the status endpoint
        const statusResponse = await fetch('http://localhost:3000/api/chat/status', {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        console.log('Status response:', statusResponse.status);
        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            console.log('Status data:', statusData);
        }
        
        // Now test the actual chat endpoint
        const chatResponse = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
                message: 'Hello, can you help me with a workout plan?'
            })
        });
        
        console.log('Chat response status:', chatResponse.status);
        
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('Chat response:', chatData);
        } else {
            const errorData = await chatResponse.text();
            console.log('Chat error:', errorData);
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testChat(); 