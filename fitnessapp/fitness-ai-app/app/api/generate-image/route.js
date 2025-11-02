import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    console.log('🎨 Generating image for:', prompt);
    
    // Pollinations.ai - Free image generation
    const enhancedPrompt = encodeURIComponent(
      `Professional fitness photography: ${prompt}. High quality, gym setting, clear lighting, realistic.`
    );
    
    const imageUrl = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1024&height=1024&nologo=true`;
    
    console.log('✅ Image URL generated');
    
    return NextResponse.json({ success: true, imageUrl });
    
  } catch (error) {
    console.error('❌ Error generating image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}