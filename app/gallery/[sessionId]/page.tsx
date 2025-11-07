"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ConceptCard from "@/components/ConceptCard";
import SectionHeader from "@/components/SectionHeader";
import InsightsPanel from "@/components/InsightsPanel";
import { useAttentionTracking } from "@/hooks/useAttentionTracking";
import { GallerySection, Concept, AttentionInsights } from "@/types";

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [gallery, setGallery] = useState<GallerySection[] | null>(null);
  const [hybrids, setHybrids] = useState<Concept[] | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<AttentionInsights | null>(null);
  const [isGeneratingHybrids, setIsGeneratingHybrids] = useState(false);
  const [viewMode, setViewMode] = useState<"original" | "hybrids">("original");

  const {
    attentionData,
    trackSectionInView,
    trackConceptHover,
    trackConceptExamine,
  } = useAttentionTracking();

  const insightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<Map<string, IntersectionObserver>>(new Map());

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

  // Set up intersection observers for sections
  useEffect(() => {
    if (!gallery) return;

    gallery.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            trackSectionInView(section.id, entry.isIntersecting);
          });
        },
        {
          threshold: 0.3, // Consider section "in view" when 30% visible
        }
      );

      observer.observe(element);
      sectionRefs.current.set(section.id, observer);
    });

    return () => {
      sectionRefs.current.forEach((observer) => observer.disconnect());
      sectionRefs.current.clear();
    };
  }, [gallery, trackSectionInView]);

  // Set up timer to show insights panel after 2 minutes
  useEffect(() => {
    if (!gallery) return;

    insightTimerRef.current = setTimeout(() => {
      calculateAndShowInsights();
    }, 120000); // 2 minutes

    return () => {
      if (insightTimerRef.current) {
        clearTimeout(insightTimerRef.current);
      }
    };
  }, [gallery]);

  const calculateAndShowInsights = useCallback(() => {
    if (!gallery) return;

    const sectionDwellArray = Object.entries(attentionData.sectionDwellTimes)
      .map(([sectionId, dwellTime]) => {
        const section = gallery.find((s) => s.id === sectionId);
        return {
          sectionId,
          sectionTitle: section?.title || "",
          dwellTime,
          interestLevel:
            dwellTime > 20000
              ? ("high" as const)
              : dwellTime > 10000
              ? ("medium" as const)
              : ("low" as const),
          examinedConcepts:
            section?.concepts.filter((c) =>
              Object.keys(attentionData.conceptExaminations).includes(c.id)
            ) || [],
        };
      })
      .sort((a, b) => b.dwellTime - a.dwellTime);

    const highInterestSections = sectionDwellArray
      .filter((s) => s.interestLevel === "high" || s.dwellTime > 5000)
      .slice(0, 3);

    const examinedConcepts = gallery
      .flatMap((section) => section.concepts)
      .filter((concept) =>
        Object.keys(attentionData.conceptExaminations).includes(concept.id)
      );

    const totalBrowsingTime = Object.values(
      attentionData.sectionDwellTimes
    ).reduce((sum, time) => sum + time, 0);

    const calculatedInsights: AttentionInsights = {
      highInterestSections,
      examinedConcepts,
      totalBrowsingTime,
      readyForHybrids: totalBrowsingTime > 30000, // 30 seconds for testing
    };

    setInsights(calculatedInsights);
    setShowInsights(true);
  }, [gallery, attentionData]);

  const handleGenerateHybrids = async () => {
    if (!gallery || !insights) return;

    setIsGeneratingHybrids(true);

    try {
      const response = await fetch("/api/generate-hybrids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          attentionData,
          originalGallery: gallery,
          challenge,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate hybrids");
      }

      const data = await response.json();
      setHybrids(data.hybrids);
      setViewMode("hybrids");
      setShowInsights(false);
    } catch (error) {
      console.error("Error generating hybrids:", error);
      alert("Failed to generate hybrid concepts. Please try again.");
    } finally {
      setIsGeneratingHybrids(false);
    }
  };

  const handleKeepBrowsing = () => {
    setShowInsights(false);
    // Set up another timer for 2 more minutes
    insightTimerRef.current = setTimeout(() => {
      calculateAndShowInsights();
    }, 120000);
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

  const currentConcepts = viewMode === "hybrids" && hybrids ? hybrids : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BluSlide.AI</h1>
              <p className="text-sm text-gray-600 mt-1">{challenge}</p>
            </div>
            <div className="flex items-center gap-4">
              {hybrids && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("original")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === "original"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Original Gallery
                  </button>
                  <button
                    onClick={() => setViewMode("hybrids")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === "hybrids"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Targeted Ideas ({hybrids.length})
                  </button>
                </div>
              )}
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {viewMode === "hybrids" && hybrids ? (
          // Hybrid Gallery View
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Targeted Ideas
              </h2>
              <p className="text-gray-600">
                Based on what caught your attention, here are {hybrids.length} concepts
                that blend the qualities you responded to.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hybrids.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  onHover={trackConceptHover}
                  onExamine={trackConceptExamine}
                />
              ))}
            </div>
          </div>
        ) : (
          // Original Gallery View
          <div>
            <div className="mb-8">
              <p className="text-gray-600 text-center">
                Browse naturally. We'll notice what resonates and suggest more of what you like.
              </p>
            </div>

            {/* Section Navigation */}
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

            {/* Gallery Sections */}
            <div className="space-y-16">
              {gallery.map((section) => (
                <section key={section.id}>
                  <SectionHeader section={section} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.concepts.map((concept) => (
                      <ConceptCard
                        key={concept.id}
                        concept={concept}
                        onHover={trackConceptHover}
                        onExamine={trackConceptExamine}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Insights Panel */}
      {showInsights && insights && (
        <InsightsPanel
          insights={insights}
          onGenerateHybrids={handleGenerateHybrids}
          onKeepBrowsing={handleKeepBrowsing}
          isGenerating={isGeneratingHybrids}
        />
      )}

      {/* Manual Insights Trigger (for testing) */}
      {!showInsights && !hybrids && (
        <button
          onClick={calculateAndShowInsights}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full
                   shadow-lg hover:bg-blue-700 transition-all font-medium"
        >
          Show Insights
        </button>
      )}
    </div>
  );
}
