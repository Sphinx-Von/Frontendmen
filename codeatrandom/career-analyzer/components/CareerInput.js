import { CAREER_ROLES } from '../lib/careerData';

export default function CareerInput({ 
  targetRole, 
  setTargetRole, 
  currentSkills, 
  setCurrentSkills,
  onAnalyze, 
  loading,
  error 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎯 Career Path Analyzer
            </h1>
            <p className="text-gray-600">
              Discover your skill gaps and get a personalized learning roadmap powered by AI
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Target Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role <span className="text-red-500">*</span>
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Select a role...</option>
                {Object.keys(CAREER_ROLES).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            {/* Current Skills Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Skills <span className="text-red-500">*</span>
              </label>
              <textarea
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g., JavaScript, HTML, CSS, React, Git"
                rows="4"
                className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                ✍️ Separate skills with commas
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Analyze Button */}
            <button
              onClick={onAnalyze}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing with AI...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  🚀 Analyze My Career Path
                </span>
              )}
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🤖</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Powered by AI</p>
                  <p className="text-blue-700">
                    This tool uses Google Gemini AI to provide personalized career recommendations and learning roadmaps tailored to your skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔒 Your data is secure and processed server-side
          </p>
        </div>
      </div>
    </div>
  );
}