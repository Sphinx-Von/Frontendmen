'use client';
import React, { useState } from 'react';
import CareerInput from '../components/CareerInput';
import Dashboard from '../components/Dashboard';

// API Base URL - change this to your Express server URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [skillGap, setSkillGap] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [techNews, setTechNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 const handleAnalyze = async () => {
  if (!targetRole || !currentSkills) {
    setError('Please fill in both target role and current skills');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // 1. Call Skill Gap Analysis API
    console.log('Calling skill-gap API...');
    const skillGapRes = await fetch(`${API_BASE_URL}/api/skill-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole,
        currentSkills
      })
    });

    if (!skillGapRes.ok) {
      const errorData = await skillGapRes.json();
      throw new Error(errorData.error || 'Failed to analyze skill gap');
    }

    const skillGapResult = await skillGapRes.json();
    console.log('Skill gap result:', skillGapResult);
    
    if (!skillGapResult.success) {
      throw new Error(skillGapResult.error || 'Skill gap analysis failed');
    }
    
    setSkillGap(skillGapResult.data);

    // 2. Call Roadmap Generation API
    console.log('Calling roadmap API...');
    const roadmapRes = await fetch(`${API_BASE_URL}/api/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole,
        currentSkills: skillGapResult.data.currentSkills.join(', '),
        missingSkills: skillGapResult.data.missing.join(', ')
      })
    });

    if (!roadmapRes.ok) {
      const errorData = await roadmapRes.json();
      throw new Error(errorData.error || 'Failed to generate roadmap');
    }

    const roadmapResult = await roadmapRes.json();
    console.log('Roadmap result:', roadmapResult);
    
    if (!roadmapResult.success) {
      throw new Error(roadmapResult.error || 'Roadmap generation failed');
    }
    
    setRoadmap(roadmapResult.data);

    // 3. Fetch HackerNews Tech Stories (NEW)
    console.log('Fetching HackerNews stories...');
    try {
      const newsRes = await fetch(`${API_BASE_URL}/api/hackernews`);
      
      if (newsRes.ok) {
        const newsResult = await newsRes.json();
        if (newsResult.success) {
          setTechNews(newsResult.data);
          console.log('Tech news fetched:', newsResult.data);
        }
      }
    } catch (newsError) {
      console.warn('Failed to fetch tech news, continuing anyway:', newsError);
      setTechNews([]);
    }

    setAnalyzed(true);
  } catch (err) {
    console.error('Analysis error:', err);
    setError(err.message || 'An error occurred during analysis');
  } finally {
    setLoading(false);
  }
};

  const handleReset = () => {
    setAnalyzed(false);
    setSkillGap(null);
    setRoadmap(null);
    setTechNews([]);
    setError('');
  };

  if (!analyzed) {
    return (
      <CareerInput
        targetRole={targetRole}
        setTargetRole={setTargetRole}
        currentSkills={currentSkills}
        setCurrentSkills={setCurrentSkills}
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <Dashboard
      skillGap={skillGap}
      roadmap={roadmap}
      techNews={techNews}
      onBack={handleReset}
    />
  );
}