"use client";

import LoadingSpinner from "./LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export default function LoadingScreen({
  message = "Generating Your Gallery...",
  showProgress = true
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Large animated spinner */}
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="xl" />
        </div>

        {/* Clear heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {message}
        </h2>

        {/* Explanation */}
        <p className="text-gray-600 text-lg mb-2">
          Creating 100+ curated concepts across 10 strategic themes
        </p>

        {/* Time estimate */}
        <p className="text-sm text-gray-500 mb-6">
          ⏳ This takes 5-10 seconds
        </p>

        {/* Animated progress bar */}
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-progress {
          animation: progress 8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
