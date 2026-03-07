"use client";

import { useRef } from "react";
import { useDataSourceStore } from "@/store/useDataSourceStore";
import type { DataSource } from "@/types/database";

export function StoreInitializer({
  dataSource,
}: {
  dataSource: DataSource | null;
}) {
  const initialized = useRef(false);
  const setCurrentDataSource = useDataSourceStore(
    (state) => state.setCurrentDataSource,
  );

  if (!initialized.current) {
    setCurrentDataSource(dataSource);
    initialized.current = true;
  }

  return null;
}
