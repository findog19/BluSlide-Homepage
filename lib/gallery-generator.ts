import Anthropic from "@anthropic-ai/sdk";
import { GallerySection } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GALLERY_GENERATION_PROMPT = `You are a strategic naming consultant generating a curated gallery of brand name concepts.

User Challenge: {userChallenge}

Generate 8 thematic sections, each containing 10-12 name concepts. Each section should represent a distinct strategic positioning.

Sections to generate:
1. Community & Warmth - Names emphasizing belonging, togetherness, shared values
2. Stability & Trust - Names emphasizing reliability, foundation, security
3. Innovation & Future - Names emphasizing newness, breakthrough, progress
4. Simplicity & Clarity - Names emphasizing ease, transparency, straightforward
5. Nature & Earth - Names emphasizing organic, natural, sustainable
6. Playful & Light - Names emphasizing joy, ease, lighthearted energy
7. Heritage & Craft - Names emphasizing tradition, quality, craftsmanship
8. Movement & Action - Names emphasizing dynamism, progress, momentum

For each concept provide:
- name: The actual brand name (2-3 words max, often 1 word)
- tagline: One sentence describing the positioning (10-15 words)
- qualities: 2-3 key attributes (e.g., "warm", "trustworthy", "modern")

Return as structured JSON matching this schema:
{
  "sections": [
    {
      "id": "community-warmth",
      "title": "Community & Warmth",
      "description": "Names emphasizing belonging and shared values",
      "concepts": [
        {
          "name": "Kindred",
          "tagline": "A community of parents supporting each other through every stage",
          "qualities": ["warm", "belonging", "collective"]
        }
      ]
    }
  ]
}

Focus on strategic diversity across sections, thoughtful positioning within sections.
Generate concepts that are memorable, distinctive, and aligned with the user's challenge.`;

export async function generateInitialGallery(
  userChallenge: string
): Promise<GallerySection[]> {
  try {
    const prompt = GALLERY_GENERATION_PROMPT.replace(
      "{userChallenge}",
      userChallenge
    );

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      temperature: 1,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the JSON from the response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Transform and validate the sections
    const sections: GallerySection[] = parsed.sections.map(
      (section: any, index: number) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        concepts: section.concepts.map((concept: any, conceptIndex: number) => ({
          id: `${section.id}-concept-${conceptIndex}`,
          name: concept.name,
          tagline: concept.tagline,
          qualities: concept.qualities,
          sectionId: section.id,
        })),
      })
    );

    return sections;
  } catch (error) {
    console.error("Error generating gallery:", error);
    throw new Error("Failed to generate gallery");
  }
}
