import { NextRequest, NextResponse } from "next/server";
import { generateHybridGallery } from "@/lib/hybrid-generator";
import { GenerateHybridsRequest, GenerateHybridsResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateHybridsRequest = await request.json();
    const { attentionData, originalGallery, challenge } = body;

    if (!attentionData || !originalGallery || !challenge) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate hybrid concepts based on attention data
    const hybrids = await generateHybridGallery(
      originalGallery,
      attentionData,
      challenge
    );

    // Calculate insights from attention data
    const sectionDwellArray = Object.entries(attentionData.sectionDwellTimes)
      .map(([sectionId, dwellTime]) => {
        const section = originalGallery.find((s) => s.id === sectionId);
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
          examinedConcepts: section?.concepts.filter((c) =>
            Object.keys(attentionData.conceptExaminations).includes(c.id)
          ) || [],
        };
      })
      .sort((a, b) => b.dwellTime - a.dwellTime);

    const highInterestSections = sectionDwellArray
      .filter((s) => s.interestLevel === "high")
      .slice(0, 3);

    const examinedConcepts = originalGallery
      .flatMap((section) => section.concepts)
      .filter((concept) =>
        Object.keys(attentionData.conceptExaminations).includes(concept.id)
      );

    const totalBrowsingTime = Object.values(
      attentionData.sectionDwellTimes
    ).reduce((sum, time) => sum + time, 0);

    const insights = {
      highInterestSections,
      examinedConcepts,
      totalBrowsingTime,
      readyForHybrids: totalBrowsingTime > 60000, // 1 minute
    };

    const response: GenerateHybridsResponse = {
      hybrids,
      insights,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in generate-hybrids API:", error);
    return NextResponse.json(
      { error: "Failed to generate hybrids" },
      { status: 500 }
    );
  }
}
