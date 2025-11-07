"use client";

import LoadingSpinner from "./LoadingSpinner";

interface SelectionWidgetProps {
  selectedCount: number;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export default function SelectionWidget({
  selectedCount,
  onGenerate,
  isGenerating = false
}: SelectionWidgetProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white shadow-2xl rounded-2xl p-6 border-2 border-blue-500 min-w-[300px]">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600">
              {selectedCount}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {selectedCount === 1 ? 'Concept' : 'Concepts'} Marked
            </p>
            <p className="text-sm text-gray-600">
              {selectedCount < 2
                ? 'Select at least 2 to combine'
                : 'Ready to generate combinations!'}
            </p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={selectedCount < 2 || isGenerating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              Generating...
            </span>
          ) : (
            `Generate Combinations (${selectedCount})`
          )}
        </button>

        {selectedCount < 2 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Mark at least 2 concepts to enable combinations
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
