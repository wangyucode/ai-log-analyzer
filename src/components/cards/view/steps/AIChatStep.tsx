"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  AlertCircle,
  ChevronLeft,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AIChatStepProps {
  selectedTables: string[];
  onBack: () => void;
  onCancel: () => void;
}

export function AIChatStep({ onBack }: AIChatStepProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 border rounded-lg bg-muted/30">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>你好！我是 AI 助手，有什么我可以帮你的吗？</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words",
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-background border shadow-sm",
            )}
          >
            <div className="flex items-center gap-2">
              {m.role === "assistant" && (
                <Sparkles className="h-3 w-3 text-primary" />
              )}
              <span className="font-semibold">
                {m.role === "user" ? "你" : "AI 助手"}
              </span>
            </div>
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {m.parts.map((part, index) => {
                if (part.type === "text")
                  return <span key={`${m.id}-part-${index}`}>{part.text}</span>;
                return null;
              })}
              {m.role === "assistant" && m.parts.length === 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <span>对话出错了，请稍后重试。</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleFormSubmit} className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onBack}
          disabled={isLoading}
          title="返回上一步"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          placeholder={isLoading ? "AI 正在思考..." : "输入您的问题..."}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
