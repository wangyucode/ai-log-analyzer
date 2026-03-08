import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { getTableSchemas, runSql } from "@/app/actions/dataSource";
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
    "你是一个专业的数据分析专家和可视化专家。你的目标是协助用户分析数据库中的数据，并生成精美、直观的可视化图表。\n" +
    (schemaPrompt ? `\n\n${schemaPrompt}` : "") +
    "\n" +
    "### 工作流程：\n" +
    "1. **理解需求**：仔细阅读用户的问题，结合当前的数据表结构进行思考。\n" +
    "2. **探索数据**：如果需要，使用 `runSql` 工具查询数据以验证你的想法或查看数据分布。请注意 SQL 只能执行 SELECT 查询，且应包含 LIMIT 以节约token和资源。\n" +
    "3. **提出方案**：向用户解释你的分析思路和建议的可视化方案。\n" +
    "4. **生成视图**：使用 `generateView` 工具生成最终的视图配置。你需要提供标题、描述、SQL 查询、图表类型、布局建议以及 Vega-Lite 配置。\n" +
    "\n" +
    "### 关于 Vega-Lite 配置 (viz_config)：\n" +
    "- 使用 standard Vega-Lite JSON 格式。\n" +
    '- `data` 属性应设为 `{"values": []}`，系统会自动将 SQL 查询结果填充到其中。\n' +
    "- 确保字段名称与你的 `query_sql` 返回的列名完全一致。\n" +
    "- 优先使用简洁、现代的设计风格。\n" +
    "\n" +
    "### 约束条件：\n" +
    "- 只能执行查询语句，不能执行 DML 语句 (INSERT, UPDATE, DELETE)。\n" +
    "- 返回给用户的信息应友好且专业。\n";

  const result = streamText({
    model: doubao(modelId),
    system: systemMessage,
    messages: await convertToModelMessages(messages),
    tools: {
      runSql: tool({
        description: "执行 SQL 查询以获取数据",
        inputSchema: z.object({
          sql: z.string().describe("要执行的查询 SQL 语句，不能是 DML 语句"),
        }),
        execute: async ({ sql }) => {
          if (!datasourceId) {
            return { success: false, error: "未选择数据源" };
          }
          return await runSql(datasourceId, sql);
        },
      }),
      generateView: tool({
        description: "生成数据可视化视图配置",
        inputSchema: z.object({
          title: z.string().describe("视图标题"),
          type: z
            .string()
            .describe("图表类型，如 bar, line, pie, area, scatter, table 等"),
          description: z.string().optional().describe("视图的简短描述"),
          query_sql: z.string().describe("用于获取图表数据的 SQL 查询语句"),
          viz_config: z
            .string()
            .describe("Vega-Lite 的 JSON 配置字符串，data 设为 { values: [] }"),
          layout_w: z
            .number()
            .optional()
            .default(1)
            .describe("视图在网格中的宽度占位 (1-4)"),
          layout_h: z
            .number()
            .optional()
            .default(1)
            .describe("视图在网格中的高度占位 (1-4)"),
        }),
        execute: async (viewData) => {
          // 这里可以进行简单的校验或直接返回，由前端处理保存逻辑
          return {
            success: true,
            message: "视图配置已生成",
            data: viewData,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
