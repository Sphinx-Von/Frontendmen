async function listModels() {
  const apiKey = "AIzaSyC5TqnK5YAUOUmaSQO8B6MGYRJDFKsHfg0"
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Available models:');
      data.models.forEach(model => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`  - ${model.name}`);
        }
      });
    } else {
      console.error('❌ ERROR:', data);
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error.message);
  }
}

listModels();