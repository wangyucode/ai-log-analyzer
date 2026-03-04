'use client';

import { useEffect } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { Button } from '@/components/ui/button';

export function LogFileList() {
  const { logFiles, isLoading, error, fetchLogFiles, selectedLog, setSelectedLog } = useLogStore();

  useEffect(() => {
    fetchLogFiles();
  }, [fetchLogFiles]);

  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900">
      <h2 className="text-xl font-bold mb-4">Log Files</h2>
      {logFiles.length === 0 ? (
        <p className="text-gray-500">No log files found.</p>
      ) : (
        <ul className="space-y-2">
          {logFiles.map((file) => (
            <li
              key={file.name}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 flex justify-between items-center ${
                selectedLog === file.name ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''
              }`}
              onClick={() => setSelectedLog(file.name)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • {new Date(file.mtime).toLocaleString()}
                </span>
              </div>
              {selectedLog === file.name && (
                <span className="text-blue-500 text-sm">Selected</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex justify-end">
         <Button onClick={() => fetchLogFiles()} variant="outline" size="sm">
            Refresh
         </Button>
      </div>
    </div>
  );
}
