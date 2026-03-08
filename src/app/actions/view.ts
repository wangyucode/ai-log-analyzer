"use server";

import db, { initDatabase } from "@/lib/db";

/**
 * 获取指定数据源的所有视图
 */
export async function getViews(dataSourceId: number) {
  try {
    await initDatabase();
    const views = await db("views")
      .where("data_source_id", dataSourceId)
      .orderBy("created_at", "desc");

    return {
      success: true,
      data: views,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "获取视图失败";
    console.error("Failed to get views:", error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * 保存视图
 */
export async function saveView(viewData: {
  data_source_id: number;
  title: string;
  type: string;
  description?: string;
  query_sql: string;
  viz_config: string;
  layout_w?: number;
  layout_h?: number;
}) {
  try {
    await initDatabase();
    const [id] = await db("views").insert(viewData);

    return {
      success: true,
      data: { id, ...viewData },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "保存视图失败";
    console.error("Failed to save view:", error);
    return {
      success: false,
      error: message,
    };
  }
}
