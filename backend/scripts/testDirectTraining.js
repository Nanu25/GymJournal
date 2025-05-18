/**
 * Script to test creating a training directly via the debug endpoint
 */
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

async function testDirectTraining() {
  console.log('Testing direct training creation via debug endpoint...');
  
  // Create a simple training with one exercise
  const trainingData = {
    date: new Date().toISOString().split('T')[0], // Today's date
    exercises: {
      "Bench Press": 100
    }
  };
  
  console.log('Sending data:', JSON.stringify(trainingData, null, 2));
  
  try {
    // First check the debug info endpoint
    console.log('\nGetting debug info...');
    const debugResponse = await fetch(`${API_URL}/api/debug/trainings`);
    
    if (!debugResponse.ok) {
      throw new Error(`Debug info failed: ${debugResponse.status} ${debugResponse.statusText}`);
    }
    
    const debugInfo = await debugResponse.json();
    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));
    
    // Now try to create a training directly
    console.log('\nCreating training...');
    const response = await fetch(`${API_URL}/api/debug/trainings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trainingData)
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Training created successfully!');
    } else {
      console.log('❌ Failed to create training');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDirectTraining().catch(console.error); 