"use client";

import { AttentionInsights } from "@/types";

interface InsightsPanelProps {
  insights: AttentionInsights;
  onGenerateHybrids: () => void;
  onKeepBrowsing: () => void;
  isGenerating?: boolean;
}

export default function InsightsPanel({
  insights,
  onGenerateHybrids,
  onKeepBrowsing,
  isGenerating = false,
}: InsightsPanelProps) {
  const browsingMinutes = Math.floor(insights.totalBrowsingTime / 60000);
  const browsingSeconds = Math.floor((insights.totalBrowsingTime % 60000) / 1000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              We've noticed some patterns
            </h2>
            <p className="text-gray-600">
              You've been browsing for {browsingMinutes}m {browsingSeconds}s. Here's what caught your attention:
            </p>
          </div>

          {/* High Interest Sections */}
          {insights.highInterestSections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sections you spent time in:
              </h3>
              <div className="space-y-3">
                {insights.highInterestSections.map((section) => (
                  <div
                    key={section.sectionId}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {section.sectionTitle}
                      </h4>
                      <span className="text-sm text-blue-600">
                        {Math.floor(section.dwellTime / 1000)}s
                      </span>
                    </div>
                    {section.examinedConcepts.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Examined: {section.examinedConcepts.map(c => c.name).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examined Concepts */}
          {insights.examinedConcepts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Concepts you examined closely:
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights.examinedConcepts.slice(0, 10).map((concept) => (
                  <span
                    key={concept.id}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                  >
                    {concept.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onGenerateHybrids}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating hybrids...
                </span>
              ) : (
                "Generate Targeted Ideas"
              )}
            </button>
            <button
              onClick={onKeepBrowsing}
              disabled={isGenerating}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              Keep Browsing
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We'll blend the qualities from concepts you examined into fresh ideas
          </p>
        </div>
      </div>
    </div>
  );
}
