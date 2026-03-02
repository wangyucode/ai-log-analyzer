# AI-Enhanced Log Analyzer / AI 驱动的日志分析器

A modern, full-stack Next.js application that leverages AI to parse, analyze, and visualize HTTP access logs. It transforms raw log data into actionable insights through an intelligent, user-driven workflow.
这是一个现代化的全栈 Next.js 应用，利用 AI 解析、分析和可视化 HTTP 访问日志。它通过智能的AI驱动工作流，将原始日志数据转化为有价值的。

## ✨ Core Features / 核心功能

- **🤖 AI-Powered Analysis / AI 智能分析**:
  - Automatically analyzes log patterns and anomalies.
  - Generates visualization proposals (charts, graphs) based on data trends.
  - **User-Centric**: You decide which AI-generated insights to save to your dashboard.
  - 自动分析日志模式和异常。
  - 基于数据趋势生成可视化建议（图表、图形）。
  - **以用户为中心**：由您决定将哪些 AI 生成的洞察保存到仪表盘。

- **🔄 Automated Log Ingestion / 自动日志摄取**:
  - Periodically scans and parses log files from the `./logs/` directory.
  - Structured data is stored efficiently in a local SQLite database.
  - 定期扫描并解析 `./logs/` 目录下的日志文件。
  - 结构化数据高效存储在本地 SQLite 数据库中。

- **📊 Dynamic Dashboard / 动态仪表盘**:
  - View saved insights and real-time metrics.
  - Customizable retention policies for historical data.
  - 查看已保存的洞察和实时指标。
  - 可自定义历史数据保留策略。

## 🚀 Workflow / 工作流程

1.  **Ingest**: Raw logs are read from the `./logs/` directory and parsed into structured data in SQLite.
    **摄取**：从 `./logs/` 目录读取原始日志，并解析为 SQLite 中的结构化数据。
2.  **Analyze**: The AI engine scans the data to identify trends, errors, or security threats and proposes visualization cards.
    **分析**：AI 引擎扫描数据以识别趋势、错误或安全威胁，并提议可视化卡片。
3.  **Review**: The user reviews the AI's proposals.
    **审核**：用户审核 AI 的提议。
4.  **Curate**: Approved insights are saved to the persistent dashboard; irrelevant ones are discarded.
    **策展**：批准的洞察被保存到持久化仪表盘；不相关的则被丢弃。

## 🛠 Deployment / 部署

We recommend using Docker and Docker Compose for easy deployment.
我们推荐使用 Docker 和 Docker Compose 进行便捷部署。

### Prerequisites / 前置条件

- Docker & Docker Compose installed.
- An OpenAI API Key (or compatible LLM provider).

### Configuration / 配置

Create a `.env` file or configure environment variables directly in `docker-compose.yml`:
创建 `.env` 文件或直接在 `docker-compose.yml` 中配置环境变量：

| Variable | Description | Default |
| :--- | :--- | :--- |
| `LOG_RETENTION_DAYS` | Number of days to keep parsed logs in the database. (日志保留天数) | `30` |
| `OPENAI_API_KEY` | API Key for the AI analysis engine. (AI 分析引擎的 API Key) | - |
| `DATABASE_URL` | Path to the SQLite database. (SQLite 数据库路径) | `file:/app/data/sqlite.db` |

### Run with Docker Compose / 使用 Docker Compose 运行

1.  **Prepare Directories / 准备目录**:
    Create `logs` and `data` directories in your project root.
    在项目根目录创建 `logs` 和 `data` 目录。

    ```bash
    mkdir logs data
    ```

2.  **Start the Service / 启动服务**:

    ```bash
    docker-compose up -d
    ```

3.  **Access the Dashboard / 访问仪表盘**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.
    在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 📂 Project Structure / 项目结构

- `./logs/`: Mount point for access log files. (日志文件挂载点)
- `./data/`: Mount point for the SQLite database persistence. (SQLite 数据库持久化挂载点)
- `docker-compose.yml`: Deployment configuration. (部署配置)

## License

MIT
