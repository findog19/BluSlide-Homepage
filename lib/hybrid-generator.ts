import { Concept } from "@/types";
import { generateText } from "./ai-client";

const HYBRID_GENERATION_PROMPT = `You are synthesizing new brand name concepts by blending qualities from concepts the user explicitly selected.

User Challenge: {userChallenge}

User selected these {count} concepts:
{selectedConcepts}

Generate 20 new hybrid concepts that blend the qualities from their selections. Do not just concatenate names - synthesize the underlying qualities.

EXAMPLES OF GOOD SYNTHESIS:
- If user selected "Kindred" (warm, community) and "Foundation" (stable, reliable)
- Generate: "Common Anchor" (shared + grounded), "Together Trust" (collective + reliable), "Kinship Rock" (belonging + solid)
- NOT: "Kindred Foundation" (too literal), "FoundKind" (awkward portmanteau)

EXAMPLES OF BAD SYNTHESIS:
- "EcoGreen" (just mashing words together)
- "FutureNext" (redundant, no synthesis)
- Simply repeating the selected concepts
- Forced combinations that don't flow naturally

SYNTHESIS STRATEGIES TO USE:
1. **Quality Blending**: Identify the core qualities and find new words that embody both
   Example: "warm" + "reliable" → "Hearth" (warm and dependable)

2. **Metaphorical Combination**: Use metaphors that capture both essences
   Example: "community" + "innovation" → "Hive Forward" (collective + progressive)

3. **Complementary Pairing**: Pair qualities that enhance each other
   Example: "playful" + "trust" → "Joybound" (fun but committed)

For each hybrid concept, clearly show which selected concepts influenced it.

Return as JSON matching this schema:
{
  "hybrids": [
    {
      "name": "Common Anchor",
      "tagline": "Shared values grounded in lasting stability",
      "qualities": ["shared", "grounded", "collective"],
      "blends": ["Kindred", "Foundation"]
    }
  ]
}

Focus on creating names that genuinely synthesize the qualities the user responded to. Make each concept feel thoughtful and purposeful.`;

export async function generateHybridGallery(
  selectedConcepts: Concept[],
  userChallenge: string
): Promise<Concept[]> {
  try {
    // Format selected concepts for prompt
    const conceptsList = selectedConcepts
      .map(c => `- ${c.name}: ${c.tagline} (${c.qualities.join(", ")})`)
      .join("\n");

    const prompt = HYBRID_GENERATION_PROMPT
      .replace("{userChallenge}", userChallenge)
      .replace("{count}", selectedConcepts.length.toString())
      .replace("{selectedConcepts}", conceptsList);

    // Generate using unified AI client (supports both Claude and OpenAI)
    const response = await generateText({
      prompt,
      maxTokens: 4000,
      temperature: 0.9, // Slightly lower for more coherent combinations
    });

    // Parse the JSON response
    const jsonMatch = response.text.match(/\{[\s\S]*"hybrids"[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse hybrid response from AI");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.hybrids || !Array.isArray(parsed.hybrids)) {
      throw new Error("Invalid response format from AI");
    }

    // Transform the hybrids into Concept objects
    const hybrids: Concept[] = parsed.hybrids.map(
      (hybrid: any, index: number) => ({
        id: `hybrid-${index}`,
        name: hybrid.name,
        tagline: hybrid.tagline,
        qualities: hybrid.qualities || [],
        sectionId: "hybrid",
        blends: hybrid.blends || [],
      })
    );

    return hybrids;
  } catch (error) {
    console.error("Error generating hybrids:", error);
    throw new Error("Failed to generate hybrid concepts");
  }
}
