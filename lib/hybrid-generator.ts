import { Concept, GallerySection, AttentionSignals } from "@/types";
import { generateText } from "./ai-client";

const HYBRID_GENERATION_PROMPT = `You are synthesizing new brand name concepts by blending qualities the user has shown interest in.

User Challenge: {userChallenge}

User showed high interest in these sections:
{highInterestSections}

Specifically, user examined these concepts:
{examinedConcepts}

Generate 20 new hybrid concepts that blend the qualities from the concepts they examined. Do not just concatenate names - synthesize the underlying qualities.

For example:
- If user examined "Kindred" (warm, community) and "Foundation" (stable, reliable)
- Don't generate "Kindred Foundation" (too literal)
- DO generate concepts like: "Common Anchor" (shared + grounded), "Together Trust" (collective + reliable)

Each hybrid should feel fresh and purposeful, not forced.

Return as JSON array matching this schema:
{
  "hybrids": [
    {
      "name": "Common Anchor",
      "tagline": "Building stable foundations through shared experiences",
      "qualities": ["warm", "stable", "collective"],
      "blendedFrom": ["Kindred", "Foundation"]
    }
  ]
}

Focus on creating names that genuinely synthesize the qualities the user responded to.`;

export async function generateHybridGallery(
  originalGallery: GallerySection[],
  attentionData: AttentionSignals,
  userChallenge: string
): Promise<Concept[]> {
  try {
    // Identify high-interest sections (top 2-3 based on dwell time)
    const sectionDwellArray = Object.entries(attentionData.sectionDwellTimes)
      .map(([sectionId, dwellTime]) => ({
        sectionId,
        dwellTime,
      }))
      .sort((a, b) => b.dwellTime - a.dwellTime)
      .slice(0, 3);

    const highInterestSectionIds = sectionDwellArray.map((s) => s.sectionId);

    const highInterestSections = originalGallery
      .filter((section) => highInterestSectionIds.includes(section.id))
      .map((section) => `- ${section.title}: ${section.description}`)
      .join("\n");

    // Get examined concepts (concepts with significant hover time)
    const examinedConceptIds = Object.entries(attentionData.conceptExaminations)
      .filter(([_, data]) => data.totalDuration > 1000) // More than 1 second
      .sort((a, b) => b[1].totalDuration - a[1].totalDuration)
      .slice(0, 10)
      .map(([id, _]) => id);

    const examinedConcepts = originalGallery
      .flatMap((section) => section.concepts)
      .filter((concept) => examinedConceptIds.includes(concept.id))
      .map(
        (concept) =>
          `- ${concept.name}: ${concept.tagline} (${concept.qualities.join(", ")})`
      )
      .join("\n");

    // If no examined concepts, use top concepts from high-interest sections
    const conceptsToUse =
      examinedConcepts ||
      originalGallery
        .filter((section) => highInterestSectionIds.includes(section.id))
        .flatMap((section) => section.concepts.slice(0, 3))
        .map(
          (concept) =>
            `- ${concept.name}: ${concept.tagline} (${concept.qualities.join(", ")})`
        )
        .join("\n");

    const prompt = HYBRID_GENERATION_PROMPT.replace(
      "{userChallenge}",
      userChallenge
    )
      .replace("{highInterestSections}", highInterestSections)
      .replace("{examinedConcepts}", conceptsToUse);

    // Generate using unified AI client (supports both Claude and OpenAI)
    const response = await generateText({
      prompt,
      maxTokens: 4000,
      temperature: 1,
    });

    // Parse the JSON response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Transform the hybrids into Concept objects
    const hybrids: Concept[] = parsed.hybrids.map(
      (hybrid: any, index: number) => ({
        id: `hybrid-${index}`,
        name: hybrid.name,
        tagline: hybrid.tagline,
        qualities: hybrid.qualities,
        sectionId: "hybrids",
        blendedFrom: hybrid.blendedFrom,
      })
    );

    return hybrids;
  } catch (error) {
    console.error("Error generating hybrids:", error);
    throw new Error("Failed to generate hybrid concepts");
  }
}
