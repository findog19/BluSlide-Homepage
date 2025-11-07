import { GallerySection } from "@/types";
import { generateText } from "./ai-client";

const DIVERSITY_RULES = `
CRITICAL DIVERSITY REQUIREMENTS:

1. FORBIDDEN LAZY PREFIXES - NEVER use these patterns:
   ❌ Eco + [anything] (e.g., "EcoNest", "EcoStroll", "EcoPath")
   ❌ Green + [anything] (e.g., "GreenPath", "GreenBaby", "GreenWay")
   ❌ Earth + [anything] (e.g., "EarthStride", "EarthWalk")
   ❌ Future + [anything] (e.g., "FutureBaby", "FutureStroll")
   ❌ Smart + [anything] (e.g., "SmartStroll", "SmartBaby")
   ❌ Next + [anything] (e.g., "NextGen", "NextStep")

2. USE VARIED CREATIVE STRATEGIES (distribute concepts across these):

   30% - Metaphorical single words:
   ✓ Examples: "Nest" (not "EcoNest"), "Haven", "Bloom", "Grove", "Anchor", "Hearth"

   25% - Creative compounds (unexpected pairs):
   ✓ Examples: "LeafStride", "MossPath", "SkyWheel", "ClayHands"
   ✗ NOT: "GreenPath", "EcoWalk" (too obvious)

   20% - Evocative standalone words:
   ✓ Examples: "Verdant", "Sylvan", "Ember", "Meadow", "Prism"

   15% - Portmanteaus (blended invented words):
   ✓ Examples: "Verly" (verdant+early), "Nestara" (nest+terra), "Bloomkin" (bloom+kin)

   10% - International/Latin roots:
   ✓ Examples: "Tierra" (earth), "Solum" (soil), "Lieto" (joy), "Vivo" (alive)

3. WITHIN EACH SECTION - ENFORCE VARIETY:
   First 3 concepts: Use metaphorical approach
   Middle 4 concepts: Use creative compounds
   Next 2 concepts: Use evocative standalone
   Last 1 concept: Use portmanteau or international

4. QUALITY TEST - Before including ANY concept, ask:
   ✓ Would a professional naming consultant suggest this?
   ✓ Does it feel hand-crafted or template-generated?
   ✓ Is it genuinely different from others in this section?
   If "NO" to any → Replace it immediately.
`;

const GALLERY_GENERATION_PROMPT = `You are a strategic naming consultant generating a curated gallery of brand name concepts.

User Challenge: {userChallenge}

Generate 10 thematic sections organized along a sophistication spectrum from practical to abstract. Each section contains 10 concepts.

SOPHISTICATION SPECTRUM (1-8):
1-2 = PRACTICAL (Clear, functional, immediately understandable)
3-4 = THEMATIC (Human-centered, aspirational, relatable)
5-6 = CREATIVE (Elegant, poetic, requires thought)
7-8 = ABSTRACT (Intellectual, conceptual, conversation-starting)

SECTIONS TO GENERATE:

**1. Direct & Clear** (Sophistication: 1)
ID: "direct-clear"
Description: "Straightforward names that immediately communicate purpose. For those who value clarity over creativity."
Instructions: Generate clear, functional, descriptive names. Examples: "TrueStep", "ClearPath", "SafeStride". Strategy: Descriptive adjective + functional noun. AVOID: Abstract metaphors, invented words, anything requiring explanation.

**2. Stability & Trust** (Sophistication: 2)
ID: "stability-trust"
Description: "Strong, reliable names that signal institutional quality and dependability."
Instructions: Generate names conveying strength and reliability. Examples: "Foundation", "Anchor", "Steadfast", "Bedrock". Strategy: Solid, concrete nouns with institutional weight. AVOID: Playful, whimsical, or overly creative options.

**3. Community & Warmth** (Sophistication: 3)
ID: "community-warmth"
Description: "Human-centered names emphasizing belonging and shared values."
Instructions: Generate warm, inclusive, community-focused names. Examples: "Kindred", "Together", "Haven", "Circle". Strategy: Words evoking human connection and belonging. AVOID: Cold, institutional, or overly abstract terms.

**4. Heritage & Craft** (Sophistication: 3)
ID: "heritage-craft"
Description: "Time-honored names celebrating tradition, quality, and craftsmanship."
Instructions: Generate names evoking quality and tradition. Examples: "Artisan", "Legacy", "Woven", "Heirloom". Strategy: Traditional craft terms, quality signals. AVOID: Modern tech terminology or future-focused language.

**5. Innovation & Future** (Sophistication: 4)
ID: "innovation-future"
Description: "Forward-thinking names that signal progress and breakthrough thinking."
Instructions: Generate forward-looking, progressive names. Examples: "Epoch", "Vertex", "Horizon", "Apex". Strategy: Future-oriented, breakthrough-suggesting terms. AVOID: Backward-looking or traditional terminology.

**6. Movement & Action** (Sophistication: 4)
ID: "movement-action"
Description: "Dynamic names emphasizing momentum, journey, and kinetic energy."
Instructions: Generate dynamic, kinetic, action-oriented names. Examples: "Stride", "Momentum", "Journey", "Velocity". Strategy: Movement verbs and progressive nouns. AVOID: Static, stationary, or passive terminology.

**7. Nature & Essence** (Sophistication: 5)
ID: "nature-essence"
Description: "Poetic natural references that evoke rather than describe. For those seeking elegance."
Instructions: Generate elegant, poetic nature-inspired names. Examples: "Verdant", "Sylvan", "Bloom", "Grove". Strategy: Sophisticated nature vocabulary. CRITICAL: ABSOLUTELY NO "Eco-X" or "Green-X" patterns! Use the diversity rules strictly.

**8. Poetic & Evocative** (Sophistication: 6)
ID: "poetic-evocative"
Description: "Sensory and atmospheric names that create emotional resonance through feeling."
Instructions: Generate sensory, atmospheric, feeling-based names. Examples: "Whisper", "Luminous", "Velvet", "Dawn". Strategy: Sensory adjectives, atmospheric nouns, emotional qualities. AVOID: Literal descriptions or functional terminology.

**9. Abstract & Conceptual** (Sophistication: 7)
ID: "abstract-conceptual"
Description: "Intellectually rich names for those who want depth and conversation-starting power."
Instructions: Generate abstract, philosophical, conceptual names. Examples: "Paradox", "Confluence", "Tessera", "Liminal", "Meridian". Strategy: Philosophical concepts, abstract thinking terms. Require names that spark curiosity and conversation. AVOID: Obvious or immediately clear meanings.

**10. Linguistic & Invented** (Sophistication: 8)
ID: "linguistic-invented"
Description: "Completely unique neologisms and portmanteaus. Maximum distinctiveness, requires explanation."
Instructions: Invent entirely new words by blending meaningful roots. Examples: "Verly" (verdant+early), "Nestara" (nest+terra), "Bloomkin" (bloom+kin). Process: 1) Identify 2 relevant roots, 2) Blend phonetically smoothest parts, 3) Ensure intuitive pronunciation, 4) Result should feel natural. Require completely unique, trademark-friendly names. AVOID: Random letter combinations or awkward sounds.

For each concept provide:
- name: The actual brand name (2-3 words max, often 1 word)
- tagline: One sentence describing the positioning (10-15 words)
- qualities: 2-3 key attributes (e.g., "warm", "trustworthy", "modern")

Return as structured JSON matching this schema:
{
  "sections": [
    {
      "id": "direct-clear",
      "title": "Direct & Clear",
      "description": "Straightforward names that immediately communicate purpose",
      "sophistication": 1,
      "concepts": [
        {
          "name": "TrueStep",
          "tagline": "Clear and reliable solutions for everyday challenges",
          "qualities": ["clear", "functional", "straightforward"]
        }
      ]
    }
  ]
}

${DIVERSITY_RULES}

Focus on strategic diversity across sections, thoughtful positioning within sections.
Generate concepts that are memorable, distinctive, and aligned with the user's challenge.
Make each concept feel hand-crafted, not template-generated.`;

export async function generateInitialGallery(
  userChallenge: string
): Promise<GallerySection[]> {
  try {
    console.log("Generating gallery for challenge:", userChallenge.substring(0, 100));

    const prompt = GALLERY_GENERATION_PROMPT.replace(
      "{userChallenge}",
      userChallenge
    );

    console.log("Prompt length:", prompt.length, "characters");
    console.log("Calling AI generation...");

    // Generate using unified AI client (supports both Claude and OpenAI)
    const response = await generateText({
      prompt,
      maxTokens: 8000,
      temperature: 1,
    });

    console.log("AI response received, length:", response.text.length);

    // Parse the JSON response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to find JSON in response. First 500 chars:", response.text.substring(0, 500));
      throw new Error("No JSON found in AI response. The AI may have returned an error or unexpected format.");
    }

    console.log("Parsing JSON response...");
    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      console.error("Invalid response structure:", parsed);
      throw new Error("AI response missing 'sections' array. Response structure is invalid.");
    }

    console.log("Found", parsed.sections.length, "sections");

    // Transform and validate the sections
    const sections: GallerySection[] = parsed.sections.map(
      (section: any, index: number) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        sophistication: section.sophistication || (index + 1), // Fallback to index if not provided
        concepts: section.concepts.map((concept: any, conceptIndex: number) => ({
          id: `${section.id}-concept-${conceptIndex}`,
          name: concept.name,
          tagline: concept.tagline,
          qualities: concept.qualities,
          sectionId: section.id,
        })),
      })
    );

    console.log("Gallery generation complete. Total concepts:", sections.reduce((sum, s) => sum + s.concepts.length, 0));

    return sections;
  } catch (error) {
    console.error("Error in generateInitialGallery:", error);
    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    throw new Error("Failed to generate gallery: " + String(error));
  }
}
