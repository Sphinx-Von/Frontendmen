// app/api/text-to-speech/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, section } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Format text for better speech based on section
    let formattedText = text;
    
    if (section === 'workout' || section === 'diet' || section === 'both') {
      // Parse JSON and format into natural speech
      const data = JSON.parse(text);
      formattedText = formatPlanForSpeech(data, section);
    }

    // ElevenLabs API configuration
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Default: Bella voice

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: formattedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to generate speech' },
        { status: response.status }
      );
    }

    // Return audio data
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to format plan data into natural speech
function formatPlanForSpeech(data, section) {
  let speech = '';

  if (section === 'workout' || (section === 'both' && data.workout)) {
    speech += 'Here is your workout plan. ';
    const workout = data.workout || data;
    
    Object.entries(workout).forEach(([day, exercises]) => {
      speech += `${day}. `;
      exercises.forEach((ex) => {
        if (ex.sets > 0) {
          speech += `${ex.name}, ${ex.sets} sets of ${ex.reps} reps, rest for ${ex.rest}. `;
        } else {
          speech += `${ex.name}. `;
        }
      });
    });
  }

  if (section === 'diet' || (section === 'both' && data.diet)) {
    if (section === 'both') {
      speech += 'Now for your diet plan. ';
    } else {
      speech += 'Here is your diet plan. ';
    }
    
    const diet = data.diet || data;
    
    Object.entries(diet).forEach(([meal, items]) => {
      speech += `For ${meal}, `;
      items.forEach((food) => {
        speech += `${food.item}, ${food.calories} calories with ${food.protein} of protein. `;
      });
    });
  }

  return speech;
}