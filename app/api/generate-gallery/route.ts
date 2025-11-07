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

    // Generate the gallery using Claude
    const sections = await generateInitialGallery(challenge);

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
    return NextResponse.json(
      { error: "Failed to generate gallery" },
      { status: 500 }
    );
  }
}
