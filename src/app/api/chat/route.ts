import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { doubao } from "@/lib/ai";

// Max duration for the API route
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 1. Call AI and stream response
  const modelId = process.env.DOUBAO_MODEL_ID || "";
  if (!modelId) {
    return new Response("DOUBAO_MODEL_ID not configured", { status: 500 });
  }

  const result = streamText({
    model: doubao(modelId),
    system:
      "你是一个专业的数据可视化专家和助手。你可以回答关于数据分析和可视化的问题。",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
