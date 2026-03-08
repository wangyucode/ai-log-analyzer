import { streamText } from "ai";
import { getTableSchemas } from "@/app/actions/dataSource";
import { getViews } from "@/app/actions/view";
import { doubao } from "@/lib/ai";

// Max duration for the API route
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const { selectedTables, dataSourceId } = data || {};

  if (!selectedTables || !dataSourceId) {
    return new Response("Missing required parameters", { status: 400 });
  }

  // 1. Fetch Schema and existing Views
  const [schemaRes, viewsRes] = await Promise.all([
    getTableSchemas(dataSourceId, selectedTables),
    getViews(dataSourceId),
  ]);

  const schemas = schemaRes.success ? schemaRes.data : {};
  const existingViews = viewsRes.success ? viewsRes.data : [];

  // 2. Build System Prompt
  const systemPrompt = `你是一个专业的数据可视化专家和 SQL 专家。
你的任务是根据用户提供的数据表结构，生成一个 Vega-Lite 可视化配置。

### 选中的数据表结构 (Schema):
${JSON.stringify(schemas, null, 2)}

### 已有的可视化视图 (作为参考):
${JSON.stringify(existingViews, null, 2)}

### 任务目标:
1. 分析用户需求。
2. 编写 SQL 查询语句 (SQLite 语法) 来获取所需数据。
3. 生成对应的 Vega-Lite 配置 (JSON 格式)。

### 输出要求:
- 必须以 JSON 格式输出，包含以下字段:
  - title: 视图标题
  - description: 视图描述
  - query_sql: 获取数据的 SQL 语句 (SQLite)
  - viz_config: Vega-Lite 的完整配置对象 (不需要包含 data 字段，系统会自动填充数据)
- 严禁包含 Markdown 代码块标记 (如 \`\`\`json)，直接输出纯 JSON 字符串。
- SQL 语句必须合法且能正确执行。
- Vega-Lite 配置必须合法且能正确渲染。

### 注意事项:
- 只使用选中的数据表中的字段。
- 优先生成有意义、易读的可视化。
- 如果用户没有明确说明，可以根据数据特点自行决定图表类型 (如柱状图、折线图、饼图等)。`;

  // 3. Call AI and stream response
  const modelId = process.env.DOUBAO_MODEL_ID || "";
  if (!modelId) {
    return new Response("DOUBAO_MODEL_ID not configured", { status: 500 });
  }

  const result = streamText({
    model: doubao(modelId),
    system: systemPrompt,
    messages,
    onFinish: (output) => {
      console.log("AI finished:", output);
    },
  });

  return result.toTextStreamResponse();
}
