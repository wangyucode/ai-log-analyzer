import { create } from "zustand";

interface LogFile {
  name: string;
  size: number;
  mtime: string;
  status: 'UNINITIALIZED' | 'PARSING' | 'READY' | 'ERROR';
  stats?: {
    recordCount: number;
    timeRange: {
      start: string;
      end: string;
    };
  };
}

interface LogStore {
  selectedLog: string | null;
  logFiles: LogFile[];
  isLoading: boolean;
  error: string | null;
  fetchLogFiles: () => Promise<void>;
  setSelectedLog: (logName: string | null) => void;
}

export const useLogStore = create<LogStore>((set) => ({
  selectedLog: null,
  logFiles: [],
  isLoading: false,
  error: null,
  fetchLogFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/logs/scan");
      if (!response.ok) {
        throw new Error("Failed to fetch log files");
      }
      const data = await response.json();
      const files = data.files || [];
      set((state) => ({
        logFiles: files,
        isLoading: false,
        selectedLog: state.selectedLog || (files.length > 0 ? files[0].name : null),
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  setSelectedLog: (logName) => set({ selectedLog: logName }),
}));
