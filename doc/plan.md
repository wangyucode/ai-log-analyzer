# AI Data Visualizer 技术方案与实现计划

本方案旨在根据 [requirements.md](doc/requirements.md) 构建一个基于 AI 的通用数据库数据可视化工具。

## 1. 技术架构设计 (Technical Architecture)

### 1.1 前端 (Frontend)
- **框架**: Next.js (App Router) + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **图表渲染**: Vega-Lite (AI 生成 JSON 配置，前端渲染)
- **状态管理**: Zustand (用于管理全局数据源、视图列表及 UI 状态)
- **交互**: 响应式网格布局 (CSS Grid)

### 1.2 后端 (Backend)
- **API**: Next.js Route Handlers (API 路由)
- **数据库访问**: Knex.js (查询构建器) + SQLite (本地存储配置及示例数据)
- **AI 集成**: Vercel AI SDK (处理对话流、函数调用及 SQL 生成)

### 1.3 数据模型 (Data Model)
- `data_sources`: 存储数据库连接信息（如 SQLite 文件路径、MySQL 连接串等）。
- `views`: 存储 AI 生成的视图配置（SQL 查询、Vega-Lite 配置、布局参数等）。

---

## 2. 详细实现步骤 (Implementation Steps)

### 第一阶段：基础框架与数据层 (Foundation & Data Layer)
1. **环境准备**:
    - 安装核心依赖: `pnpm add knex sqlite3 better-sqlite3 vega vega-lite vega-embed`
    - 初始化 Knex 配置，连接本地 SQLite 数据库。
2. **数据模型构建**:
    - 创建 `src/lib/db` 目录，初始化数据库 Schema (`data_sources`, `views`)。
3. **全局状态管理**:
    - 创建 `src/store/useStore.ts`，定义 `DataSource` 和 `View` 的状态及操作。
4. **API 基础路由**:
    - 实现 `GET /api/data-sources` 和 `GET /api/views`。

### 第二阶段：仪表盘 UI 开发 (Dashboard UI)
1. **响应式网格布局**:
    - 在 `src/app/page.tsx` 中实现 `Grid Layout`，支持不同屏幕尺寸的自动排版。
2. **核心卡片组件**:
    - 开发 `DataSourceInfoCard`: 显示当前数据源概览（Order: -1）。
    - 开发 `AddViewCard`: 仪表盘末尾的“+”号卡片，点击弹出 AI 对话框。
3. **视图渲染组件**:
    - 开发 `ChartView`: 封装 `vega-embed`，根据传入的 `viz_config` 渲染图表。

### 第三阶段：AI 交互与 SQL 生成 (AI & SQL Generation)
1. **AI SDK 集成**:
    - 配置 `src/app/api/chat/route.ts`，使用 Vercel AI SDK。
2. **AI Tool Calling (函数调用)**:
    - 定义 AI 可调用的工具：`listTables`, `getTableSchema`, `previewQueryData`。
3. **Prompt 工程**:
    - 编写系统提示词 (System Prompt)，引导 AI 根据 Schema 生成准确的 SQL 和 Vega-Lite 配置。

### 第四阶段：视图保存与管理 (View Persistence)
1. **预览与保存流程**:
    - 在 AI 对话框中展示生成图表的预览。
    - 实现 `POST /api/views` 接口，保存视图配置到数据库。
2. **实时同步**:
    - 保存成功后，立即更新 Zustand store 并重新渲染仪表盘。
3. **视图管理**:
    - 实现视图的删除和基本配置（标题、描述、布局大小）修改。
