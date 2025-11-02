import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY not found');
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('✅ Generating plan for:', data.name);

    const prompt = `
Create a detailed 7-day personalized fitness and diet plan for:
Name: ${data.name}
Age: ${data.age}, Gender: ${data.gender}
Height: ${data.height}cm, Weight: ${data.weight}kg
Goal: ${data.goal}
Fitness Level: ${data.fitnessLevel}
Workout Location: ${data.location}
Diet Type: ${data.diet}
Medical History: ${data.medicalHistory || 'None'}
Stress Level: ${data.stressLevel || 'Medium'}

CRITICAL: Return ONLY valid JSON with this EXACT structure. No markdown, no explanations:

{
  "workout": {
    "monday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "tuesday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "wednesday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "thursday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "friday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "saturday": [
      {
        "name": "Exercise name",
        "sets": 3,
        "reps": 10,
        "rest": "60s"
      }
    ],
    "sunday": [
      {
        "name": "Rest day or light activity",
        "sets": 0,
        "reps": 0,
        "rest": "0"
      }
    ]
  },
  "diet": {
    "breakfast": [
      {
        "item": "Food item name",
        "calories": "300",
        "protein": "20g"
      }
    ],
    "lunch": [
      {
        "item": "Food item name",
        "calories": "500",
        "protein": "30g"
      }
    ],
    "dinner": [
      {
        "item": "Food item name",
        "calories": "400",
        "protein": "25g"
      }
    ],
    "snacks": [
      {
        "item": "Snack name",
        "calories": "150",
        "protein": "10g"
      }
    ]
  },
  "tips": [
    "Tip 1 as a string",
    "Tip 2 as a string",
    "Tip 3 as a string"
  ]
}

Provide 3-5 exercises per day and 2-3 items per meal. Make it personalized based on the user's data.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error?.message || 'API request failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Response received');
    
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!text) {
      console.error('❌ Empty response');
      return NextResponse.json(
        { success: false, error: 'No response from Gemini' },
        { status: 500 }
      );
    }

    // Parse JSON
    let plan;
    try {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/g, '')
        .trim();
      
      plan = JSON.parse(cleaned);
      console.log('✅ Plan generated successfully');
      
      // Validate structure
      if (!plan.workout || !plan.diet || !plan.tips) {
        throw new Error('Invalid plan structure');
      }
      
    } catch (parseErr) {
      console.error('❌ Failed to parse JSON:', parseErr);
      console.error('Raw response:', text.substring(0, 500));
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse AI response. Please try again.',
          details: text.substring(0, 200)
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, plan });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate plan' },
      { status: 500 }
    );
  }
}