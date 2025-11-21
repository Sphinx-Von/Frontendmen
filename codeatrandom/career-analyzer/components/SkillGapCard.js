export default function SkillGapCard({ skillGap }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎓</span>
        Skill Gap Analysis
      </h2>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🤖</span>
          <div>
            <p className="font-semibold text-gray-800 mb-2">AI Recommendations</p>
            <p className="text-gray-700 leading-relaxed">
              {skillGap.recommendations}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="space-y-4">
        {/* Matched Skills */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Skills You Have ({skillGap.matched.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillGap.matched.length > 0 ? (
              skillGap.matched.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">No matched skills yet</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Skills to Learn ({skillGap.missing.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillGap.missing.length > 0 ? (
              skillGap.missing.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  ⚡ {skill}
                </span>
              ))
            ) : (
              <p className="text-green-600 font-medium">
                🎉 You have all the required skills!
              </p>
            )}
          </div>
        </div>

        {/* Suggested Learning Order */}
        {skillGap.suggestedLearningOrder && skillGap.suggestedLearningOrder.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Suggested Learning Order
            </h3>
            <ol className="space-y-2">
              {skillGap.suggestedLearningOrder.map((skill, index) => (
                <li
                  key={index}
                  className="flex items-center p-3 bg-indigo-50 rounded-lg"
                >
                  <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-800 font-medium">{skill}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}