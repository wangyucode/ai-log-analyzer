import { LogFileList } from "@/components/LogFileList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl flex flex-col items-start gap-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          AI Log Analyzer
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <LogFileList />
          </div>
          <div className="md:col-span-2 p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 min-h-[400px] flex items-center justify-center text-gray-400">
            Select a log file to view analysis
          </div>
        </div>
      </main>
    </div>
  );
}
