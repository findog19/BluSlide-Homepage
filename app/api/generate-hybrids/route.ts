import { NextRequest, NextResponse } from "next/server";
import { generateHybridGallery } from "@/lib/hybrid-generator";
import { Concept } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedConcepts, challenge, originalGallery } = body;

    if (!selectedConcepts || !Array.isArray(selectedConcepts)) {
      return NextResponse.json(
        { error: "selectedConcepts is required and must be an array" },
        { status: 400 }
      );
    }

    if (selectedConcepts.length < 2) {
      return NextResponse.json(
        { error: "Must select at least 2 concepts" },
        { status: 400 }
      );
    }

    if (!challenge) {
      return NextResponse.json(
        { error: "challenge is required" },
        { status: 400 }
      );
    }

    // Generate hybrids from selected concepts only
    const hybrids = await generateHybridGallery(
      selectedConcepts as Concept[],
      challenge
    );

    return NextResponse.json({ hybrids });
  } catch (error) {
    console.error("Hybrid generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate hybrid concepts" },
      { status: 500 }
    );
  }
}
