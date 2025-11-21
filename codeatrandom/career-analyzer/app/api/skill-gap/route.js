// app/api/skill-gap/route.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { CAREER_ROLES } = require('../../../lib/careerData');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;

    // Validation
    if (!targetRole || !currentSkills) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: targetRole and currentSkills are required' 
      });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        success: false,
        error: 'Gemini API key not configured on server' 
      });
    }

    // Process skills
    const requiredSkills = CAREER_ROLES[targetRole] || [];
    const currentSkillsArray = currentSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    
    const matched = requiredSkills.filter(skill => 
      currentSkillsArray.some(cs => cs.toLowerCase() === skill.toLowerCase())
    );
    
    const missing = requiredSkills.filter(skill => 
      !currentSkillsArray.some(cs => cs.toLowerCase() === skill.toLowerCase())
    );

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ... rest of your code stays the same









    const prompt = `You are a career advisor analyzing skill gaps for a ${targetRole} position.

Current Skills: ${currentSkillsArray.join(', ') || 'None'}
Required Skills: ${requiredSkills.join(', ')}
Matched Skills: ${matched.join(', ') || 'None'}
Missing Skills: ${missing.join(', ') || 'None'}

Provide:
1. A personalized recommendation (2-3 sentences) on what to focus on first
2. A suggested learning order for the missing skills (prioritize by importance and learning dependency)

Format your response as JSON with this structure:
{
  "recommendations": "your recommendation here",
  "suggestedLearningOrder": ["skill1", "skill2", "skill3"]
}

Return ONLY the JSON object, no additional text or markdown.`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse AI response
    let aiData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        recommendations: text,
        suggestedLearningOrder: missing.length > 0 ? missing : ["Advanced topics"]
      };
    } catch (parseError) {
      console.error('AI response parsing error:', parseError);
      aiData = {
        recommendations: missing.length > 0 
          ? `Focus on learning ${missing.slice(0, 3).join(', ')} to bridge your skill gap.`
          : "You have all the core skills! Consider deepening your expertise.",
        suggestedLearningOrder: missing.length > 0 ? missing : ["Advanced topics", "System design"]
      };
    }

    // Send success response
    return res.status(200).json({
      success: true,
      data: {
        targetRole,
        requiredSkills,
        currentSkills: currentSkillsArray,
        matched,
        missing,
        recommendations: aiData.recommendations,
        suggestedLearningOrder: aiData.suggestedLearningOrder,
        matchPercentage: requiredSkills.length > 0 
          ? Math.round((matched.length / requiredSkills.length) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Skill gap analysis error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to analyze skill gap',
      details: error.message 
    });
  }
});

module.exports = router;