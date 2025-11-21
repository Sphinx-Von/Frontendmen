// check-gemini-models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ Error: GEMINI_API_KEY not found in .env file');
      process.exit(1);
    }

    console.log('🔑 API Key loaded successfully\n');
    console.log('🧪 Testing Gemini models...\n');
    console.log('='.repeat(80));

    const genAI = new GoogleGenerativeAI(apiKey);

    // List of common Gemini models to test
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-pro',
      'gemini-2.0-flash-exp'
    ];

    const workingModels = [];
    const failedModels = [];

    for (const modelName of modelsToTest) {
      try {
        console.log(`\n📝 Testing: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Try a simple test prompt
        const result = await model.generateContent('Say "Hello" if you can read this.');
        const response = await result.response;
        const text = response.text();
        
        console.log(`   ✅ SUCCESS - Response: ${text.substring(0, 50)}...`);
        workingModels.push(modelName);
        
      } catch (error) {
        console.log(`   ❌ FAILED - ${error.message}`);
        failedModels.push({ model: modelName, error: error.message });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 RESULTS:\n');
    
    console.log(`✅ Working Models (${workingModels.length}):`);
    workingModels.forEach(model => {
      console.log(`   ✓ ${model}`);
    });

    if (failedModels.length > 0) {
      console.log(`\n❌ Failed Models (${failedModels.length}):`);
      failedModels.forEach(item => {
        console.log(`   ✗ ${item.model}`);
        console.log(`     Reason: ${item.error.split('\n')[0]}`);
      });
    }

    if (workingModels.length > 0) {
      console.log('\n\n🎯 RECOMMENDED MODEL TO USE:');
      console.log(`   ${workingModels[0]}`);
      console.log('\n📝 Update your route files with:');
      console.log(`   const model = genAI.getGenerativeModel({ model: "${workingModels[0]}" });`);
    } else {
      console.log('\n⚠️  No working models found. Please check your API key.');
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\n💡 Tip: Check if your GEMINI_API_KEY is valid');
      console.error('   Get your API key from: https://makersuite.google.com/app/apikey');
    }
  }
}

// Run the script
testGeminiModels();