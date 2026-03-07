import { create } from "zustand";
import type { DataSource } from "@/types/database";

interface DataSourceState {
  currentDataSource: DataSource | null;
  setCurrentDataSource: (ds: DataSource | null) => void;
}

export const useDataSourceStore = create<DataSourceState>((set) => ({
  currentDataSource: null,
  setCurrentDataSource: (ds) => set({ currentDataSource: ds }),
}));
