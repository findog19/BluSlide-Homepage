import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Configuration for which AI provider to use
const AI_PROVIDER = (process.env.AI_PROVIDER || "anthropic").toLowerCase();

// Lazy-initialized clients (only initialize when needed)
let anthropic: Anthropic | null = null;
let openai: OpenAI | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface AIGenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
}

/**
 * Unified AI client that works with both Anthropic Claude and OpenAI
 */
export async function generateText(
  options: AIGenerateOptions
): Promise<AIResponse> {
  const {
    prompt,
    maxTokens = 8000,
    temperature = 1,
  } = options;

  if (AI_PROVIDER === "openai") {
    return await generateWithOpenAI(prompt, maxTokens, temperature);
  } else {
    return await generateWithAnthropic(prompt, maxTokens, temperature);
  }
}

async function generateWithAnthropic(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature: temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    return { text };
  } catch (error) {
    console.error("Error with Anthropic API:", error);
    throw new Error("Failed to generate with Anthropic Claude");
  }
}

async function generateWithOpenAI(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for best quality
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      response_format: { type: "text" },
    });

    const text = completion.choices[0]?.message?.content || "";
    return { text };
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw new Error("Failed to generate with OpenAI");
  }
}

/**
 * Get the current AI provider being used
 */
export function getAIProvider(): string {
  return AI_PROVIDER;
}

/**
 * Check if AI client is properly configured
 */
export function isAIConfigured(): boolean {
  if (AI_PROVIDER === "openai") {
    return !!process.env.OPENAI_API_KEY;
  } else {
    return !!process.env.ANTHROPIC_API_KEY;
  }
}
