# AI Data Visualizer 需求文档

## 1. 项目概述 (Project Overview)
本项目旨在开发一个基于 AI 的通用数据库数据可视化工具。用户只需连接数据库，系统即可通过 AI 自动分析数据结构、提供可视化建议，并允许用户通过自然语言对话生成自定义的数据图表面板，无需编写任何前端或后端代码。

## 2. 核心功能 (Core Features)

### 2.1 数据源管理 (Data Source Management)
*   **多源支持**: 支持连接多种数据库（如 SQLite, MySQL, PostgreSQL 等）。
*   **自动扫描**: 自动识别已连接数据库中的表结构和元数据。
*   **状态标识**: 区分“已同步”和“待配置”的数据源。

### 2.2 仪表盘与视图布局 (Dashboard & Layout)
*   **网格布局**: 内容区域采用灵活的网格系统 (Grid Layout) 展示各种可视化视图。
*   **数据源概览 (DataSource Info)**:
    *   **Order**: -1 (始终置顶)。
    *   **内容**: 展示当前连接的数据源基本信息、表数量、记录总数等。
    *   **操作**: 提供数据源切换、同步状态更新等功能。
*   **自定义视图**: 展示用户通过 AI 生成的各种数据可视化图表。

### 2.3 智能化数据分析 (AI Data Analysis)
1.  **结构分析**: AI 自动扫描选定的表，识别字段含义、数据类型及可能的关联关系。
2.  **智能建议**: 基于数据分布和特征，AI 自动推荐适合的可视化维度。
3.  **零代码转换**: 用户无需了解 SQL 或图表库配置，全部由 AI 驱动完成。

### 2.4 交互式视图生成 (Interactive View Generation)
*   **入口**: 在所有视图的最后显示一个“+”号卡片。
*   **AI 聊天界面**: 点击“+”号弹出对话框，提供两种模式：
    *   **自然语言生成**: 用户输入提示词（如“展示过去三个月每个产品的销售额占比”）。
    *   **智能探索**: 点击“分析现有数据”，由 AI 推荐有价值的可视化方向。
*   **生成过程**:
    1.  AI 根据提示词和数据库 Schema，生成对应的查询 SQL 或数据聚合逻辑。
    2.  生成视图配置：
        *   **View Name**: 视图名称。
        *   **View Description**: 简介。
        *   **View Type**: 图表类型 (Line, Bar, Pie, Table, Metric, etc.)。
        *   **Layout Config**: 宽高 (w, h)，例如 1x1, 2x4。
        *   **Order**: 排序权重 (>0)。
    3.  **预览**: 后端运行SQL并组合视图配置，前端渲染预览图表。

### 2.5 视图管理与保存 (View Management)
*   **编辑与反馈**: 用户可以在预览阶段修改标题、描述、布局配置。
*   **重新生成**: 如果结果不满意，可要求 AI 重新生成或微调查询逻辑。
*   **保存**: 用户点击“保存”后，将视图配置和查询逻辑存入 `views` 表，并立即渲染在仪表盘中。

## 3. 系统架构建议 (System Architecture)

### 3.1 核心组件
*   **Next.js App**: 全栈框架，处理前端渲染和 API 路由。
*   **Vercel AI SDK**: 对话和函数调用。
*   **SQLite/Local Storage**: 存储用户配置的数据源信息和保存的视图。
*   **Vega-Lite**: 用于渲染可视化图表的 JSON 配置格式。

### 3.2 数据模型 (Meta Database Schema)

#### `data_sources` (数据源配置表)
| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 ID |
| type | TEXT | 数据库类型 (sqlite, mysql, csv, etc.) |
| connection_info | JSON | 连接字符串或文件路径 |
| name | TEXT | 数据源别名 |
| schema_snapshot | JSON | AI 分析后的结构快照 |
| status | TEXT | CONNECTED, ERROR |
| created_at | DATETIME | 创建时间 |

#### `views` (视图配置表)
| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 ID |
| data_source_id | INTEGER | 关联的数据源 ID |
| title | TEXT | 视图标题 |
| description | TEXT | 视图描述 |
| query_sql | TEXT | 查询 SQL |
| layout_w | INTEGER | 宽度占位 |
| layout_h | INTEGER | 高度占位 |
| layout_order | INTEGER | 排序权重 |
| viz_config | JSON | 可视化JSON配置 |
