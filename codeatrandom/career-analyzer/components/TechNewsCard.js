import React from 'react';
import { BookOpen, ExternalLink, TrendingUp, MessageSquare, User, Calendar } from 'lucide-react';

export default function TechNewsCard({ techNews }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle no news
  if (!techNews || techNews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="text-orange-600" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Latest Tech News</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 mb-2">No tech news available</p>
          <p className="text-sm text-gray-400">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="text-orange-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Tech News</h2>
          </div>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            HackerNews
          </span>
        </div>
        <p className="text-sm text-gray-600 ml-13">Stay updated with the latest in tech</p>
      </div>

      {/* News List */}
      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {techNews.map((story, index) => (
          <div 
            key={story.id || index} 
            className="group border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
          >
            {/* Story Title */}
            <h3 className="font-semibold text-gray-800 mb-3 leading-snug">
              {story.url ? (
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors flex items-start group"
                >
                  <span className="flex-1">{story.title}</span>
                  <ExternalLink 
                    className="ml-2 mt-1 w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-orange-600" 
                  />
                </a>
              ) : (
                <a 
                  href={`https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  {story.title}
                </a>
              )}
            </h3>

            {/* Story Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Score */}
              <div className="flex items-center text-gray-600">
                <TrendingUp size={14} className="mr-1.5 text-green-500" />
                <span className="font-medium">{story.score || 0}</span>
                <span className="ml-1 text-gray-500">points</span>
              </div>

              {/* Comments */}
              <div className="flex items-center text-gray-600">
                <MessageSquare size={14} className="mr-1.5 text-blue-500" />
                <span className="font-medium">{story.descendants || story.comments || 0}</span>
                <span className="ml-1 text-gray-500">comments</span>
              </div>

              {/* Author */}
              {story.by && (
                <div className="flex items-center text-gray-600">
                  <User size={14} className="mr-1.5 text-purple-500" />
                  <span className="truncate">{story.by}</span>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-1.5 text-orange-500" />
                <span>{formatTime(story.time)}</span>
              </div>
            </div>

            {/* Type Badge */}
            {story.type && (
              <div className="mt-2">
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {story.type}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <a
          href="https://news.ycombinator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-orange-600 hover:text-orange-800 font-semibold transition-colors"
        >
          View more on HackerNews
          <ExternalLink size={14} className="ml-1" />
        </a>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}