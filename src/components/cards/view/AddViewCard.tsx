"use client";

import { Check, Loader2, Plus, Table as TableIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getTables } from "@/app/actions/dataSource";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDataSourceStore } from "@/store/useDataSourceStore";
import { DashboardCard } from "../../DashboardCard";

export function AddViewCard() {
  const { currentDataSource } = useDataSourceStore();
  const [open, setOpen] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
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
    if (open && currentDataSource) {
      loadTables();
    }
  }, [open, currentDataSource, loadTables]);

  const toggleTable = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName],
    );
  };

  const handleConfirm = () => {
    if (selectedTables.length === 0) return;
    console.log("Selected tables:", selectedTables);
    // TODO: Implement view creation logic
    setOpen(false);
    setSelectedTables([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer h-full">
          <DashboardCard
            title="添加视图"
            desc="从数据源中选择表格创建新的分析视图"
            colSpan={1}
            rowSpan={1}
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/50 transition-colors group/add">
              <Plus className="h-8 w-8 text-muted-foreground group-hover/add:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground mt-2 group-hover/add:text-primary">
                点击添加
              </span>
            </div>
          </DashboardCard>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>选择数据表</DialogTitle>
          <p className="text-sm text-muted-foreground">
            请选择要分析的数据表（可多选，至少选择 1 个）
          </p>
        </DialogHeader>

        <div className="py-4 max-h-[300px] overflow-y-auto pr-2">
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedTables([]);
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedTables.length === 0 || loading}
          >
            确定 {selectedTables.length > 0 && `(${selectedTables.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
