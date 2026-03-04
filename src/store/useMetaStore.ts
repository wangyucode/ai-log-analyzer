import { create } from "zustand";
import { useLogStore } from "./useLogStore";

export interface LogMeta {
  file: string;
  table_name: string | null;
  parser_script: string | null;
  last_read_offset: number | string | null;
  create_sql: string | null;
  insert_sql: string | null;
  retention_days: number | null;
  status: "UNINITIALIZED" | "READY";
  created_at: string;
}

interface MetaStore {
  metaInfo: LogMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchMetaInfo: (file: string) => Promise<void>;
  reset: () => void;
}

export const useMetaStore = create<MetaStore>((set) => ({
  metaInfo: null,
  isLoading: false,
  error: null,

  fetchMetaInfo: async (file: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/logs/info/${encodeURIComponent(file)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch log metadata");
      }
      const data = await response.json();
      set({ metaInfo: data.info, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
        metaInfo: null,
      });
    }
  },

  reset: () => set({ metaInfo: null, isLoading: false, error: null }),
}));

// Subscribe to changes in selectedLog
useLogStore.subscribe(
  (state) => state.selectedLog,
  (selectedLog) => {
    if (selectedLog) {
      useMetaStore.getState().fetchMetaInfo(selectedLog);
    } else {
      useMetaStore.getState().reset();
    }
  },
  { fireImmediately: true },
);
