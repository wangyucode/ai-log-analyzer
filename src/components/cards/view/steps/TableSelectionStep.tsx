"use client";

import { Check, Loader2, Table as TableIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getTables } from "@/app/actions/dataSource";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDataSourceStore } from "@/store/useDataSourceStore";

interface TableSelectionStepProps {
  selectedTables: string[];
  onSelect: (tables: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function TableSelectionStep({
  selectedTables,
  onSelect,
  onNext,
  onCancel,
}: TableSelectionStepProps) {
  const { currentDataSource } = useDataSourceStore();
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTables = useCallback(async () => {
    if (!currentDataSource) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTables(currentDataSource.id);
      if (result.success && result.data) {
        setTables(result.data);
      } else {
        setError(result.error || "获取表列表失败");
      }
    } catch (err) {
      setError("加载表格时发生错误");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentDataSource]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const toggleTable = (tableName: string) => {
    const nextSelected = selectedTables.includes(tableName)
      ? selectedTables.filter((t) => t !== tableName)
      : [...selectedTables, tableName];
    onSelect(nextSelected);
  };

  return (
    <>
      <div className="py-4 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground mt-2">
              正在加载表格...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={loadTables}
            >
              重试
            </Button>
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">未找到可用表格</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {tables.map((table) => (
              <div
                key={table}
                onClick={() => toggleTable(table)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedTables.includes(table)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <TableIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{table}</span>
                </div>
                {selectedTables.includes(table) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedTables.length === 0 || loading}
        >
          下一步 {selectedTables.length > 0 && `(${selectedTables.length})`}
        </Button>
      </div>
    </>
  );
}
