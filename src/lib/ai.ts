import { generateText, streamText } from "ai";
import { createDoubao } from "doubao-ai-provider";

// Initialize the Doubao AI provider
const doubao = createDoubao({
  apiKey: process.env.DOUBAO_API_KEY,
});

// Default model ID from environment variables
const defaultModelId =
  process.env.DOUBAO_MODEL_ID || "doubao-seed-2-0-mini-260215";

/**
 * Unified interface for AI text generation
 */
export async function askAI(prompt: string, systemPrompt?: string) {
  if (!defaultModelId) {
    throw new Error(
      "DOUBAO_MODEL_ID is not configured in environment variables.",
    );
  }

  const { text } = await generateText({
    model: doubao(defaultModelId),
    prompt,
    system: systemPrompt,
  });

  return text;
}

/**
 * Unified interface for AI streaming text generation
 */
export async function streamAI(prompt: string, systemPrompt?: string) {
  if (!defaultModelId) {
    throw new Error(
      "DOUBAO_MODEL_ID is not configured in environment variables.",
    );
  }

  return streamText({
    model: doubao(defaultModelId),
    prompt,
    system: systemPrompt,
  });
}

export { doubao };
