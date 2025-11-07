"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConceptCard from "@/components/ConceptCard";
import SectionHeader from "@/components/SectionHeader";
import SelectionWidget from "@/components/SelectionWidget";
import LoadingScreen from "@/components/LoadingScreen";
import { GallerySection, Concept } from "@/types";

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [gallery, setGallery] = useState<GallerySection[] | null>(null);
  const [hybrids, setHybrids] = useState<Concept[] | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingHybrids, setIsGeneratingHybrids] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());
  const [showHybrids, setShowHybrids] = useState(false);

  // Load gallery data from sessionStorage
  useEffect(() => {
    const sessionData = sessionStorage.getItem(`gallery-${sessionId}`);
    if (sessionData) {
      const data = JSON.parse(sessionData);
      setGallery(data.sections);
      setChallenge(data.challenge);
      setIsLoading(false);
    } else {
      // Redirect back to home if no session data
      router.push("/");
    }
  }, [sessionId, router]);

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcepts(prev => {
      const next = new Set(prev);
      if (next.has(conceptId)) {
        next.delete(conceptId);
      } else {
        next.add(conceptId);
      }
      return next;
    });
  };

  const handleGenerateCombinations = async () => {
    if (!gallery || selectedConcepts.size < 2) {
      alert("Please select at least 2 concepts to combine");
      return;
    }

    setIsGeneratingHybrids(true);

    // Get full concept objects for selected IDs
    const selectedFull = gallery.flatMap(section =>
      section.concepts.filter(c => selectedConcepts.has(c.id))
    );

    try {
      const response = await fetch("/api/generate-hybrids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedConcepts: selectedFull,
          challenge: challenge,
          originalGallery: gallery
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate combinations");
      }

      const data = await response.json();
      setHybrids(data.hybrids);
      setShowHybrids(true);
    } catch (error) {
      console.error("Error generating hybrids:", error);
      alert("Failed to generate combinations. Please try again.");
    } finally {
      setIsGeneratingHybrids(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return null;
  }

  return (
    <>
      {isGeneratingHybrids && <LoadingScreen message="Generating Combinations..." />}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BluSlide.AI</h1>
                <p className="text-sm text-gray-600 mt-1">{challenge}</p>
              </div>
              <div className="flex items-center gap-4">
                {showHybrids ? (
                  <button
                    onClick={() => setShowHybrids(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    ← Back to Gallery
                  </button>
                ) : (
                  <div className="text-sm text-gray-600">
                    {selectedConcepts.size} selected
                  </div>
                )}
                <button
                  onClick={() => router.push("/")}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {!showHybrids ? (
            <>
              {/* Helper text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-900">
                  <strong>💡 How it works:</strong> Browse the concepts below. Click the ⭐ star on any that resonate with you.
                  Once you've marked at least 2, we'll generate creative combinations that blend their qualities.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Tip:</strong> Practical users, start at the top. Creative explorers, dive into the bottom sections!
                </p>
              </div>

              {/* Section navigation */}
              <nav className="mb-8 bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {gallery.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600
                               hover:bg-blue-50 rounded-md transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </nav>

              {/* Gallery sections */}
              <div className="space-y-16">
                {gallery.map((section) => (
                  <section key={section.id}>
                    <SectionHeader section={section} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {section.concepts.map((concept) => (
                        <ConceptCard
                          key={concept.id}
                          concept={concept}
                          isSelected={selectedConcepts.has(concept.id)}
                          onSelect={handleConceptSelect}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Selection widget */}
              <SelectionWidget
                selectedCount={selectedConcepts.size}
                onGenerate={handleGenerateCombinations}
                isGenerating={isGeneratingHybrids}
              />
            </>
          ) : (
            <>
              {/* Hybrids view */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Targeted Combinations
                </h2>
                <p className="text-gray-600">
                  Based on your {selectedConcepts.size} selections, here are {hybrids?.length || 20} concepts that blend their qualities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hybrids?.map((hybrid) => (
                  <ConceptCard
                    key={hybrid.id}
                    concept={hybrid}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
