import React from 'react';
import { TrendingUp, Clock, Target, Rocket } from 'lucide-react';

export default function RoadmapCard({ roadmap }) {
  // Handle both data structures: roadmap object with nested roadmap array, or direct array
  const phases = roadmap?.roadmap || roadmap || [];
  const totalDuration = roadmap?.totalDuration || '';
  const targetRole = roadmap?.targetRole || '';

  const phaseIcons = [
    { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Rocket, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const borderColors = [
    'border-blue-600',
    'border-purple-600',
    'border-green-600'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Career Roadmap</h2>
          </div>
          {totalDuration && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Clock size={14} className="mr-1" />
              {totalDuration}
            </div>
          )}
        </div>
        {targetRole && (
          <p className="text-gray-600 ml-13">
            Personalized path for <span className="font-semibold text-indigo-600">{targetRole}</span>
          </p>
        )}
      </div>

      {/* Roadmap Phases */}
      <div className="space-y-6">
        {phases.map((phase, idx) => {
          const phaseIcon = phaseIcons[idx % phaseIcons.length];
          const IconComponent = phaseIcon.icon;
          const borderColor = borderColors[idx % borderColors.length];

          return (
            <div key={idx} className="relative">
              {/* Connection Line */}
              {idx < phases.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent" 
                     style={{ height: 'calc(100% + 1.5rem)' }}>
                </div>
              )}

              {/* Phase Card */}
              <div className={`relative border-l-4 ${borderColor} pl-4 pb-2`}>
                <div className="flex items-start mb-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 ${phaseIcon.bg} rounded-lg flex items-center justify-center mr-3 shadow-sm z-10`}>
                    <IconComponent className={phaseIcon.color} size={20} />
                  </div>

                  {/* Phase Header */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {phase.phase}
                    </h3>
                    {phase.duration && (
                      <span className="text-xs text-gray-500 font-medium">
                        ⏱️ {phase.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phase Description */}
                {phase.description && (
                  <p className="text-sm text-gray-600 italic mb-3 ml-13">
                    {phase.description}
                  </p>
                )}

                {/* Skills List */}
                <ul className="space-y-2 ml-13">
                  {phase.skills.map((skill, skillIdx) => (
                    <li 
                      key={skillIdx} 
                      className="text-gray-700 flex items-start bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-indigo-600 mr-2 font-bold">→</span>
                      <span className="text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>     
    </div>
  );
}