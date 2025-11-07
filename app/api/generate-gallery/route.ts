import { NextRequest, NextResponse } from "next/server";
import { generateInitialGallery } from "@/lib/gallery-generator";
import { GenerateGalleryRequest, GenerateGalleryResponse } from "@/types";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateGalleryRequest = await request.json();
    const { challenge } = body;

    if (!challenge || typeof challenge !== "string") {
      return NextResponse.json(
        { error: "Challenge is required" },
        { status: 400 }
      );
    }

    console.log("Starting gallery generation for challenge:", challenge.substring(0, 50) + "...");

    // Check if AI is configured
    const aiProvider = process.env.AI_PROVIDER || "anthropic";
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

    console.log("AI Provider:", aiProvider);
    console.log("Has Anthropic key:", hasAnthropicKey);
    console.log("Has OpenAI key:", hasOpenAIKey);

    if (aiProvider === "anthropic" && !hasAnthropicKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      return NextResponse.json(
        { error: "AI provider not configured. Please set ANTHROPIC_API_KEY environment variable." },
        { status: 500 }
      );
    }

    if (aiProvider === "openai" && !hasOpenAIKey) {
      console.error("OPENAI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI provider not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Generate the gallery using AI
    const sections = await generateInitialGallery(challenge);

    console.log("Gallery generated successfully. Sections:", sections.length);

    // Create a session ID
    const sessionId = randomUUID();

    // In a production app, we'd store this in a database
    // For MVP, we'll return it and store client-side
    const response: GenerateGalleryResponse = {
      sessionId,
      sections,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in generate-gallery API:", error);

    // Return more detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate gallery",
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}
