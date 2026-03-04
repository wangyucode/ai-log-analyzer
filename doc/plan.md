# AI Log Analyzer 开发计划

本文档基于 `requirements.md` 和 `README.md` 制定，旨在将开发过程拆解为细粒度、可独立验证的步骤。

## 阶段 1: 项目初始化与基础架构 (Initialization & Infrastructure)

### 1.1 初始化项目骨架
- [x] **任务**: 使用 Next.js 初始化项目，配置 TypeScript, Tailwind CSS。
- [x] **验证**: `pnpm dev` 能够启动默认页面。

### 1.2 集成 Shadcn UI 与基础组件
- [x] **任务**: 安装 shadcn-ui，添加 Button, Card, DropdownMenu, Dialog, Input, ScrollArea 等常用组件。

### 1.3 数据库环境搭建 (DuckDB)
- [x] **任务**: 安装 `duckdb-async` 

### 1.4 目录结构与模拟数据
- [x] **任务**: 创建 `logs/` 目录，放入几个测试日志文件。

## 阶段 2: 日志文件管理 (Log Management)

### 2.1 后端：日志文件扫描 API
- [x] **任务**: 创建 API `GET /api/logs/scan`，扫描 `logs/` 目录下的文件。
- [x] **验证**: 访问 API 能返回文件列表 JSON。

### 2.2 数据库：日志元数据表 (`log_files`)
- [ ] **任务**: 在应用启动或首次访问时，初始化 SQLite/DuckDB 中的 `log_files` 表 (id, file_path, status, etc.)。
- [ ] **验证**: 查询数据库确认表已创建。

### 2.3 前端：日志状态管理 (Zustand)
- [ ] **任务**: 创建 `store/useLogStore.ts`，管理当前选中的日志文件和文件列表。
- [ ] **验证**: 在页面展示从 API 获取的日志文件列表。

### 2.4 前端：顶部导航栏与文件选择
- [ ] **任务**: 实现顶部导航栏，包含文件选择下拉菜单。
- [ ] **验证**: 能够通过下拉菜单切换当前选中的日志文件 ID。

## 阶段 3: 智能化初始化流程 (AI Initialization)

### 3.1 后端：读取日志样本 API
- [ ] **任务**: 创建 API `GET /api/logs/:id/preview`，读取指定日志文件的前 100 行。
- [ ] **验证**: API 返回日志的前 100 行文本。

### 3.2 集成 AI SDK
- [ ] **任务**: 配置 Vercel AI SDK (OpenAI Provider)。设置环境变量。
- [ ] **验证**: 创建一个简单的测试 API，调用 AI 返回 "Hello World"。

### 3.3 AI 分析与 SQL 生成 (Core)
- [ ] **任务**: 实现 Prompt Engineering，将日志样本发送给 AI，要求返回：
    1. `CREATE TABLE` 语句
    2. 解析正则表达式或代码
    3. 字段列表
- [ ] **验证**: 针对 Nginx 日志，AI 能生成正确的建表语句和正则。

### 3.4 后端：执行初始化
- [ ] **任务**: 创建 API `POST /api/logs/:id/initialize`。
    1. 调用 AI 分析。
    2. 在 DuckDB 中执行 `CREATE TABLE`。
    3. 更新 `log_files` 表状态为 `READY`，保存解析配置。
- [ ] **验证**: 点击初始化后，数据库中出现了对应的日志表。

### 3.5 后端：数据导入 (Data Ingestion)
- [ ] **任务**: 实现日志解析逻辑（使用 AI 生成的正则），将日志文件内容批量插入 DuckDB。
- [ ] **验证**: 查询生成的日志表，确认有数据。

## 阶段 4: 仪表盘与基础视图 (Dashboard & Layout)

### 4.1 仪表盘网格布局
- [ ] **任务**: 引入 Grid 布局库 (如 `react-grid-layout` 或简单的 CSS Grid)。
- [ ] **验证**: 页面展示一个空的网格区域。

### 4.2 默认视图 (App Info)
- [ ] **任务**: 实现 "App Info" 卡片，显示当前日志文件的统计信息（行数、时间范围）。
- [ ] **验证**: 仪表盘默认显示该卡片，数据准确。

### 4.3 数据库：视图配置表 (`views`)
- [ ] **任务**: 创建 `views` 表，用于存储图表配置。
- [ ] **验证**: 表结构正确。

## 阶段 5: 交互式视图生成 (Interactive View Generation)

### 5.1 视图创建入口
- [ ] **任务**: 在仪表盘末尾添加 "+" 号卡片，点击弹出对话框。
- [ ] **验证**: 点击能打开对话框。

### 5.2 AI 视图生成 API
- [ ] **任务**: 创建 API `POST /api/views/generate`。接收用户 Prompt，结合表结构，让 AI 生成 SQL 查询和图表配置 (ECharts)。
- [ ] **验证**: 输入 "统计每小时请求数"，AI 返回包含 `SELECT count(*) ... GROUP BY hour` 的 JSON。

### 5.3 动态图表渲染组件
- [ ] **任务**: 封装 `ChartComponent`，基于 ECharts，根据传入的 type (Line, Bar) 和 data 渲染图表。
- [ ] **验证**: 手动传入 mock 数据，能渲染出图表。

### 5.4 预览与执行
- [ ] **任务**: 在对话框中，前端拿到 AI 生成的 SQL，调用后端 `POST /api/query` 执行查询，并将结果渲染在预览区。
- [ ] **验证**: 对话框中能看到根据 Prompt 生成的图表预览。

## 阶段 6: 视图持久化与管理 (View Management)

### 6.1 保存视图
- [ ] **任务**: 在预览对话框提供 "保存" 按钮，调用 API 将配置存入 `views` 表。
- [ ] **验证**: 保存后，刷新页面，仪表盘上能显示新添加的图表。

### 6.2 仪表盘加载视图
- [ ] **任务**: 仪表盘加载时，从 `views` 表获取当前日志关联的所有视图并渲染。
- [ ] **验证**: 之前保存的视图能自动加载。

### 6.3 视图编辑与删除 (Optional)
- [ ] **任务**: 允许调整视图大小或删除视图。
- [ ] **验证**: UI 操作能同步更新数据库。

## 阶段 7: 高级功能与优化 (Polish)

### 7.1 文件监听 (File Watching)
- [ ] **任务**: 集成 `chokidar`，监听 `logs/` 目录。
- [ ] **验证**: 新增日志文件时，前端列表自动刷新；追加日志内容时，触发增量解析 (Advanced)。

### 7.2 错误处理与 Loading 状态
- [ ] **任务**: 全局添加 Loading 指示器，优化 AI 失败时的错误提示。
- [ ] **验证**: 模拟网络延迟或 AI 错误，UI 表现友好。
