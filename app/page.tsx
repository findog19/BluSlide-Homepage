"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [challenge, setChallenge] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!challenge.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challenge }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate gallery");
      }

      const data = await response.json();

      // Store session data in sessionStorage
      sessionStorage.setItem(
        `gallery-${data.sessionId}`,
        JSON.stringify({
          sections: data.sections,
          challenge: challenge,
        })
      );

      // Navigate to the gallery page
      router.push(`/gallery/${data.sessionId}`);
    } catch (error) {
      console.error("Error generating gallery:", error);
      alert("Failed to generate gallery. Please try again.");
      setIsGenerating(false);
    }
  };

  const exampleChallenges = [
    "Name my sustainable baby stroller company",
    "Brand my artisan coffee roastery",
    "Name my mental health app for teens",
    "Brand my eco-friendly cleaning products",
    "Name my remote work productivity tool",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            BluSlide.AI
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            The Idea Gallery
          </p>
          <p className="text-base text-gray-500">
            Explore curated concepts. Discover what resonates. Refine your direction.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="challenge"
                className="block text-lg font-medium text-gray-900 mb-3"
              >
                What do you need creative help with?
              </label>
              <textarea
                id="challenge"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g., Name my sustainable baby stroller company"
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all resize-none"
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              disabled={!challenge.trim() || isGenerating}
              className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-all duration-200 text-lg"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating your gallery...
                </span>
              ) : (
                "Explore Ideas"
              )}
            </button>
          </form>

          <div className="mt-10">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Try these examples:
            </p>
            <div className="space-y-2">
              {exampleChallenges.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setChallenge(example)}
                  disabled={isGenerating}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600
                           hover:bg-gray-50 rounded-md transition-colors border border-gray-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            BluSlide.AI learns from your browsing behavior to suggest ideas that match your taste.
          </p>
          <p className="mt-2">
            No signup required. Your session is private and temporary.
          </p>
        </div>
      </div>
    </main>
  );
}
