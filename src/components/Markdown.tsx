import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  role?: "user" | "assistant" | string;
  className?: string;
}

export function Markdown({ content, role, className }: MarkdownProps) {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 mb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 mb-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          code: ({
            className,
            children,
            ...props
          }: React.ComponentPropsWithoutRef<"code">) => {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            return inline ? (
              <code
                className={cn(
                  "px-1 py-0.5 rounded text-xs",
                  role === "user" ? "bg-primary-foreground/20" : "bg-muted",
                )}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={cn(
                  "block p-2 rounded text-xs overflow-x-auto my-2",
                  role === "user" ? "bg-primary-foreground/20" : "bg-muted",
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table
                className={cn(
                  "min-w-full border-collapse border text-xs",
                  role === "user"
                    ? "border-primary-foreground/20"
                    : "border-border",
                )}
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className={cn(
                "border p-1 bg-muted font-bold",
                role === "user"
                  ? "border-primary-foreground/20 bg-primary-foreground/10"
                  : "border-border bg-muted",
              )}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className={cn(
                "border p-1",
                role === "user"
                  ? "border-primary-foreground/20"
                  : "border-border",
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
