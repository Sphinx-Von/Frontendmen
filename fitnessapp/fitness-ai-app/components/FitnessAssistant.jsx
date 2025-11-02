"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Dumbbell, Utensils, Volume2, Download, RefreshCw, Moon, Sun, Sparkles } from 'lucide-react';



const FitnessAssistant = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

const [selectedImage, setSelectedImage] = useState(null);
const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
const [isLoadingImage, setIsLoadingImage] = useState(false);
const [motivation, setMotivation] = useState('');

const [isSpeaking, setIsSpeaking] = useState(false);
const [currentAudio, setCurrentAudio] = useState(null);
const [showVoiceModal, setShowVoiceModal] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    fitnessLevel: '',
    location: '',
    diet: '',
    medicalHistory: '',
    stressLevel: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('fitnessData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    generateMotivation();
  }, []);

  const generateMotivation = () => {
    const quotes = [
      "Your body can stand almost anything. It's your mind that you have to convince.",
      "The only bad workout is the one that didn't happen.",
      "Strength doesn't come from what you can do. It comes from overcoming what you once thought you couldn't.",
      "Push yourself because no one else is going to do it for you.",
      "Success starts with self-discipline."
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate Fitness Plan-----------------------------------------------------------------------------------------------------------
 const generatePlan = async () => {
  setIsGenerating(true);
  localStorage.setItem('fitnessData', JSON.stringify(formData));
  
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (data.success) {
      setGeneratedPlan(data.plan);
      setStep(2);
    } else {
      alert('Failed to generate plan. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};


// Text-to-Speech Functionality------------------------------------------------------------------------------------------------------
const speakPlan = async (section) => {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    setCurrentAudio(null);
  }

  setIsSpeaking(true);
  setShowVoiceModal(false);
  
  try {
    let text = '';
    
    if (section === 'workout') {
      text = JSON.stringify(generatedPlan.workout);
    } else if (section === 'diet') {
      text = JSON.stringify(generatedPlan.diet);
    } else if (section === 'both') {
      text = JSON.stringify({
        workout: generatedPlan.workout,
        diet: generatedPlan.diet
      });
    }
    
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, section }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    setCurrentAudio(audio);
    
    audio.onended = () => {
      setIsSpeaking(false);
      setCurrentAudio(null);
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.onerror = () => {
      setIsSpeaking(false);
      setCurrentAudio(null);
      alert('Error playing audio');
    };
    
    await audio.play();
  } catch (error) {
    console.error('Error playing audio:', error);
    alert('Failed to play audio');
    setIsSpeaking(false);
  }
};

const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    setCurrentAudio(null);
  }
  setIsSpeaking(false);
};


// Image Generation Functionality---------------------------------------------------------------------------------------------------
const generateImage = async (item) => {
  setSelectedImage(item);
  setGeneratedImageUrl(null);
  setIsLoadingImage(true);
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: item }),
    });

    const data = await response.json();
    if (data.success) {
      setGeneratedImageUrl(data.imageUrl);
    } else {
      alert('Failed to generate image. Please try again.');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    alert('Error generating image. Please try again.');
  } finally {
    setIsLoadingImage(false);
  }
};

// Export PDF Function
const exportPDF = async () => {
  if (!generatedPlan) {
    alert('No plan to export!');
    return;
  }

  try {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageHeight = 280;

    // Helper function to check if we need a new page
    const checkPage = () => {
      if (y > pageHeight) {
        doc.addPage();
        y = 20;
      }
    };

    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('AI Fitness Plan', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated for ${formData.name}`, 105, 30, { align: 'center' });

    y = 50;
    doc.setTextColor(0, 0, 0);

    // Personal Information
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Personal Information', 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    
    const personalInfo = [
      `Name: ${formData.name}`,
      `Age: ${formData.age} | Gender: ${formData.gender}`,
      `Height: ${formData.height} cm | Weight: ${formData.weight} kg`,
      `Goal: ${formData.goal}`,
      `Fitness Level: ${formData.fitnessLevel}`,
      `Location: ${formData.location}`,
      `Diet Preference: ${formData.diet}`
    ];

    personalInfo.forEach(info => {
      doc.text(info, 14, y);
      y += lineHeight;
    });

    y += 10;
    checkPage();

    // Workout Plan
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('🏋️ Workout Plan', 14, y);
    y += 10;

    Object.entries(generatedPlan.workout).forEach(([day, exercises]) => {
      checkPage();
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(day, 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      exercises.forEach(ex => {
        checkPage();
        const exerciseText = ex.sets > 0 
          ? `• ${ex.name} - ${ex.sets} sets × ${ex.reps} | Rest: ${ex.rest}`
          : `• ${ex.name}`;
        
        const lines = doc.splitTextToSize(exerciseText, 180);
        lines.forEach(line => {
          doc.text(line, 18, y);
          y += lineHeight;
        });
      });

      y += 5;
    });

    // Diet Plan
    doc.addPage();
    y = 20;

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(236, 72, 153);
    doc.text('🍽️ Diet Plan', 14, y);
    y += 10;

    Object.entries(generatedPlan.diet).forEach(([meal, items]) => {
      checkPage();
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(meal, 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      items.forEach(food => {
        checkPage();
        const foodText = `• ${food.item} - ${food.calories} | ${food.protein}`;
        doc.text(foodText, 18, y);
        y += lineHeight;
      });

      y += 5;
    });

    // Tips
    y += 10;
    checkPage();

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('💡 Tips & Recommendations', 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    generatedPlan.tips.forEach((tip, index) => {
      checkPage();
      const tipLines = doc.splitTextToSize(`${index + 1}. ${tip}`, 180);
      tipLines.forEach(line => {
        doc.text(line, 14, y);
        y += lineHeight;
      });
      y += 3;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated by AI Fitness Coach - Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
      doc.text(
        new Date().toLocaleDateString(),
        190,
        290,
        { align: 'right' }
      );
    }

    doc.save(`${formData.name}_Fitness_Plan.pdf`);
    alert('PDF downloaded successfully!');
    
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Failed to export PDF. Please try again.');
  }
};
  //Regenerate Plan Function
const regeneratePlan = async () => {
  if (!confirm('Are you sure you want to generate a new plan? This will replace your current plan.')) {
    return;
  }
  
  setGeneratedPlan(null);
  setIsGenerating(true);
  
  try {
    await generatePlan();
  } catch (error) {
    console.error('Error regenerating plan:', error);
    alert('Failed to regenerate plan. Please try again.');
    setIsGenerating(false);
  }
};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'}`}>
   
   {/**Generating overlay-------------------------------------------------------------------------------- */}
{isGenerating && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4`}>
      {/* Spinning Circle */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Generating Your Plan</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          AI is creating a personalized plan for you...
        </p>
      </div>
      
      {/* Animated Dots */}
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  </div>
)}

 {/* Image genertaion Model */}
{/* NEW IMAGE MODAL ADDED HERE */}
{selectedImage && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => {
      setSelectedImage(null);
      setGeneratedImageUrl(null);
    }}
  >
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{selectedImage}</h3>
        <button
          onClick={() => {
            setSelectedImage(null);
            setGeneratedImageUrl(null);
          }}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-all`}
        >
          <span className="text-2xl">×</span>
        </button>
      </div>
      
      <div className="flex items-center justify-center min-h-[300px]">
        {isLoadingImage ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generating image...
            </p>
          </div>
        ) : generatedImageUrl ? (
          <div className="w-full">
            <img 
              src={generatedImageUrl} 
              alt={selectedImage}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="%236b7280" font-size="16">Failed to load image</text></svg>';
              }}
            />
            <div className="mt-4 flex gap-2">
              <a 
                href={generatedImageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-all"
              >
                Open Full Size
              </a>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setGeneratedImageUrl(null);
                }}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Click generate to see the image
          </p>
        )}
      </div>
    </div>
  </div>
)}


{/*Speech Model Added Here*/ }
{/* Voice Selection Modal */}
{showVoiceModal && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setShowVoiceModal(false)}
  >
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl max-w-md w-full`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Choose What to Listen</h3>
        <button
          onClick={() => setShowVoiceModal(false)}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-all`}
        >
          <span className="text-2xl">×</span>
        </button>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => speakPlan('workout')}
          disabled={isSpeaking}
          className="w-full flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Dumbbell className="w-5 h-5" />
          <span className="flex-1 text-left font-semibold">Workout Plan Only</span>
          <Volume2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => speakPlan('diet')}
          disabled={isSpeaking}
          className="w-full flex items-center gap-3 p-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Utensils className="w-5 h-5" />
          <span className="flex-1 text-left font-semibold">Diet Plan Only</span>
          <Volume2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => speakPlan('both')}
          disabled={isSpeaking}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          <span className="flex-1 text-left font-semibold">Complete Plan (Both)</span>
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className={`mt-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Your plan will be read aloud using AI voice
      </p>
    </div>
  </div>
)}

{/* Speaking Indicator */}
{isSpeaking && (
  <div className="fixed bottom-6 right-6 z-40">
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-2xl flex items-center gap-3`}>
      <div className="flex gap-1">
        <div className="w-1 h-8 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="w-1 h-8 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-1 h-8 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
      </div>
      <span className="font-semibold">Speaking...</span>
      <button
        onClick={stopSpeaking}
        className="ml-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
      >
        Stop
      </button>
    </div>
  </div>
)}









      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">AI Fitness Coach</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Motivation Quote */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-400 to-pink-400'} shadow-xl`}>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">Daily Motivation</h3>
          </div>
          <p className="text-lg italic">{motivation}</p>
        </div>

        {step === 1 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
            <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  placeholder="Your age"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Height (cm) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  placeholder="Height in cm"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  placeholder="Weight in kg"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Fitness Goal *</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="endurance">Build Endurance</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Fitness Level *</label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Workout Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select location</option>
                  <option value="home">Home</option>
                  <option value="gym">Gym</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Dietary Preference *</label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Stress Level</label>
                <select
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value="">Select level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">Medical History (Optional)</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                  rows="3"
                  placeholder="Any injuries, conditions, or medications..."
                />
              </div>
            </div>

            <button
              onClick={generatePlan}
              disabled={isGenerating || !formData.name || !formData.age}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Fitness Plan
                </>
              )}
            </button>
          </div>
        )}

        {step === 2 && generatedPlan && (
          <div>
            <div className="flex gap-4 mb-6 flex-wrap">
              <button
                onClick={exportPDF}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg transition-all`}
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
             <button
  onClick={regeneratePlan}
  disabled={isGenerating}
  className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
  } shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
>
  <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
  {isGenerating ? 'Regenerating...' : 'Regenerate'}
</button>
              
            </div>

            {/* Workout Plan */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 mb-6`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold">Workout Plan</h2>
                </div>
                <button
                  onClick={() => speakPlan('workout')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </button>
              </div>

              {Object.entries(generatedPlan.workout).map(([day, exercises]) => (
                <div key={day} className="mb-6">
                  <h3 className="text-xl font-bold mb-4 capitalize">{day}</h3>
                  <div className="grid gap-3">
                    {exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        onClick={() => generateImage(ex.name)}
                        className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition-all flex justify-between items-center`}
                      >
                        <div>
                          <p className="font-semibold">{ex.name}</p>
                          {ex.sets > 0 && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {ex.sets} sets × {ex.reps} reps | Rest: {ex.rest}
                            </p>
                          )}
                        </div>
                        <Camera className="w-5 h-5 text-purple-600" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Diet Plan */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 mb-6`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-pink-600" />
                  <h2 className="text-2xl font-bold">Diet Plan</h2>
                </div>
                <button
                  onClick={() => speakPlan('diet')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </button>
              </div>

              {Object.entries(generatedPlan.diet).map(([meal, items]) => (
                <div key={meal} className="mb-6">
                  <h3 className="text-xl font-bold mb-4 capitalize">{meal}</h3>
                  <div className="grid gap-3">
                    {items.map((food, idx) => (
                      <div
                        key={idx}
                        onClick={() => generateImage(food.item)}
                        className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition-all flex justify-between items-center`}
                      >
                        <div>
                          <p className="font-semibold">{food.item}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {food.calories} cal | {food.protein} protein
                          </p>
                        </div>
                        <Camera className="w-5 h-5 text-pink-600" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
              <h2 className="text-2xl font-bold mb-4">AI Tips & Recommendations</h2>
              <ul className="space-y-3">
                {generatedPlan.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default FitnessAssistant;