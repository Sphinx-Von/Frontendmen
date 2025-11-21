import SkillGapCard from './SkillGapCard';
import RoadmapCard from './RoadmapCard';

export default function Dashboard({ skillGap, roadmap, techNews, onBack }) {
  console.log('Dashboard techNews:', techNews); // Debug log
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📊 Career Analysis Results
              </h1>
              <p className="text-gray-600">
                Your personalized career development plan for{' '}
                <span className="font-semibold text-indigo-600">
                  {skillGap?.targetRole}
                </span>
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ← Start New Analysis
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {skillGap && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Match Percentage</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {skillGap.matchPercentage}%
                  </p>
                </div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Skills Matched</p>
                  <p className="text-3xl font-bold text-green-600">
                    {skillGap.matched.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Skills to Learn</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {skillGap.missing.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEFT SIDE (Skill Gap) + RIGHT SIDE (Roadmap) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* LEFT SIDE - Skill Gap Results */}
          <div className="space-y-6">
            {skillGap && <SkillGapCard skillGap={skillGap} />}
          </div>

          {/* RIGHT SIDE - Career Roadmap */}
          <div className="space-y-6">
            {roadmap && <RoadmapCard roadmap={roadmap} />}
          </div>
        </div>

        {/* BOTTOM SECTION - Latest Tech News (Full Width) */}
        {techNews && techNews.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                📰 Latest Tech News from HackerNews
              </h2>
              <span className="text-sm text-gray-500">
                Top {techNews.length} stories
              </span>
            </div>
            <div className="space-y-4">
              {techNews.map((story, index) => (
                <div 
                  key={story.id} 
                  className="border-l-4 border-indigo-500 bg-gray-50 pl-4 pr-4 py-4 hover:bg-indigo-50 transition rounded-r-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-indigo-600">
                          #{index + 1}
                        </span>
                        <a 
                          href={story.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition"
                        >
                          {story.title}
                        </a>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="text-orange-500">⬆️</span>
                          <strong>{story.score}</strong> points
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          by <strong>{story.by}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🕒</span>
                          {story.timeFormatted}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {story.type}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={story.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium whitespace-nowrap"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">📰</span>
              <p className="text-gray-600 text-lg">
                No tech news available at the moment
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Tech news will be fetched from HackerNews API
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}