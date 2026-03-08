import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getTableSchemas } from "@/app/actions/dataSource";
import { doubao } from "@/lib/ai";

// Max duration for the API route
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    selectedTables,
    datasourceId,
  }: { messages: UIMessage[]; selectedTables: string[]; datasourceId: number } =
    await req.json();
  // 1. 获取选定表的 Schema
  let schemaPrompt = "";
  if (datasourceId && selectedTables && selectedTables.length > 0) {
    const result = await getTableSchemas(datasourceId, selectedTables);
    if (result.success && result.data) {
      schemaPrompt = "\n以下是当前选择的数据表结构：\n";
      for (const [tableName, columns] of Object.entries(result.data)) {
        schemaPrompt += `\n表格 [${tableName}]:\n`;
        // biome-ignore lint/suspicious/noExplicitAny: columns from PRAGMA table_info
        columns.forEach((col: any) => {
          schemaPrompt += `- ${col.name} (${col.type})${col.pk ? " [Primary Key]" : ""}${col.notnull ? " [Not Null]" : ""}\n`;
        });
      }
    }
  }

  // 2. Call AI and stream response
  const modelId = process.env.DOUBAO_MODEL_ID || "";
  if (!modelId) {
    return new Response("DOUBAO_MODEL_ID not configured", { status: 500 });
  }

  const systemMessage =
    "你是一个专业的数据可视化专家和SQL专家。可以提供数据分析和可视化的建议。" +
    (schemaPrompt ? `\n\n${schemaPrompt}` : "");

  const result = streamText({
    model: doubao(modelId),
    system: systemMessage,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
