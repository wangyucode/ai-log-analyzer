"use client";

import { useLogStore } from "@/store/useLogStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Play, BarChart3, Clock, Database } from "lucide-react";

export function AppInfo() {
  const { selectedLog, logFiles } = useLogStore();

  const currentLog = logFiles.find((f) => f.name === selectedLog);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleInitialize = () => {
    // This will be implemented in the future, for now just a placeholder
    console.log("Initialize log analysis for:", selectedLog);
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">App Info & Log Status</CardTitle>
        <Info className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!selectedLog ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Database className="w-8 h-8 mb-2 opacity-20" />
            <p>Please select a log file to see details</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{selectedLog}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Database className="w-4 h-4" /> {formatSize(currentLog?.size || 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {currentLog ? new Date(currentLog.mtime).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  currentLog?.status === 'READY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  currentLog?.status === 'PARSING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                  currentLog?.status === 'ERROR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {currentLog?.status || 'UNINITIALIZED'}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
              {currentLog?.status === 'UNINITIALIZED' || currentLog?.status === 'ERROR' ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This log file has not been initialized for analysis yet.
                  </p>
                  <Button onClick={handleInitialize} className="w-full md:w-auto" size="sm">
                    <Play className="w-4 h-4 mr-2" /> Initialize Analysis
                  </Button>
                </div>
              ) : currentLog?.status === 'READY' && currentLog.stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Records</p>
                    <p className="text-2xl font-bold">{currentLog.stats.recordCount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Time Range</p>
                    <p className="text-sm font-medium">
                      {new Date(currentLog.stats.timeRange.start).toLocaleDateString()}<br />
                      to {new Date(currentLog.stats.timeRange.end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : currentLog?.status === 'PARSING' ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">AI is currently analyzing the log structure...</p>
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full animate-progress origin-left"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
                  <BarChart3 className="w-4 h-4" />
                  No statistics available yet
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
