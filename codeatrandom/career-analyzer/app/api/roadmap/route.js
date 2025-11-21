// app/api/roadmap/route.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ROADMAPS } = require('../../../lib/careerData');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { targetRole, currentSkills, missingSkills} = req.body;

    // Validation
    if (!targetRole) {
      return res.status(400).json({ 
        success: false,
        error: 'Target role is required' 
      });
    }

     const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ 
        success: false,
        error: 'Gemini API key is required' 
      });
    }

    // Get base roadmap
    const baseRoadmap = ROADMAPS[targetRole] || [
      { phase: "Phase 1 (2 months)", skills: ["Foundation skills", "Basic concepts"] },
      { phase: "Phase 2 (3 months)", skills: ["Intermediate topics", "Practical projects"] },
      { phase: "Phase 3 (2 months)", skills: ["Advanced topics", "Real-world applications"] }
    ];

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a career advisor creating a personalized learning roadmap for a ${targetRole}.

Current Skills: ${currentSkills || 'Beginner level'}
Missing Skills to Focus On: ${missingSkills || 'All core skills'}

Base Roadmap Structure:
${JSON.stringify(baseRoadmap, null, 2)}

Create a personalized 3-phase roadmap that:
1. Prioritizes the missing skills
2. Groups skills logically by learning dependencies
3. Provides realistic timeframes
4. Includes actionable learning goals

Return ONLY a JSON array with this exact structure (no markdown, no additional text):
[
  {
    "phase": "Phase 1 (1-2 months)",
    "duration": "1-2 months",
    "skills": ["skill1", "skill2", "skill3"],
    "description": "Brief description of this phase focus"
  },
  {
    "phase": "Phase 2 (2-3 months)",
    "duration": "2-3 months",
    "skills": ["skill4", "skill5", "skill6"],
    "description": "Brief description of this phase focus"
  },
  {
    "phase": "Phase 3 (1-2 months)",
    "duration": "1-2 months",
    "skills": ["skill7", "skill8"],
    "description": "Brief description of this phase focus"
  }
]`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse AI response
    let personalizedRoadmap;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      personalizedRoadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : baseRoadmap;
      
      // Validate structure
      if (!Array.isArray(personalizedRoadmap) || personalizedRoadmap.length === 0) {
        console.warn('Invalid roadmap structure from AI, using base roadmap');
        personalizedRoadmap = baseRoadmap;
      }

      // Ensure all phases have required fields
      personalizedRoadmap = personalizedRoadmap.map((phase, index) => ({
        phase: phase.phase || `Phase ${index + 1}`,
        duration: phase.duration || "2-3 months",
        skills: Array.isArray(phase.skills) ? phase.skills : [],
        description: phase.description || "Focus on core fundamentals"
      }));

    } catch (parseError) {
      console.error('Failed to parse AI roadmap:', parseError);
      personalizedRoadmap = baseRoadmap;
    }

    // Calculate total duration
    const totalMonths = personalizedRoadmap.reduce((acc, phase) => {
      const months = phase.duration?.match(/\d+/g) || [3];
      return acc + parseInt(months[0]);
    }, 0);

    // Send success response
    return res.status(200).json({
      success: true,
      data: {
        targetRole,
        roadmap: personalizedRoadmap,
        totalDuration: `${totalMonths} months (estimated)`,
        totalPhases: personalizedRoadmap.length
      }
    });

  } catch (error) {
    console.error('Roadmap generation error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to generate roadmap',
      details: error.message 
    });
  }
});

module.exports = router;