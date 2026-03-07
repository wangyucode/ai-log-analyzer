"use client";

import { useDataSourceStore } from "@/store/useDataSourceStore";
import { DashboardCard } from "./DashboardCard";
import { DataSourceInfo } from "./DataSourceInfo";
import { NoDataSourceFound } from "./NoDataSourceFound";

export function DataSourceManager() {
  const currentDataSource = useDataSourceStore(
    (state) => state.currentDataSource,
  );

  return (
    <DashboardCard
      title="数据源管理"
      desc={
        currentDataSource
          ? "当前已连接的数据源信息"
          : "连接数据库以开始 AI 数据分析"
      }
      colSpan={3}
      order={-1}
    >
      {currentDataSource ? (
        <DataSourceInfo dataSource={currentDataSource} />
      ) : (
        <NoDataSourceFound />
      )}
    </DashboardCard>
  );
}
