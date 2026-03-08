"use client";

import { Check, Layout, Loader2 } from "lucide-react";
import type { GenerateViewArgs } from "@/components/cards/view/steps/AIChatStep";
import { Button } from "@/components/ui/button";

interface GenerateViewOutput {
  data: GenerateViewArgs;
  success: boolean;
  message: string;
}

interface GenerateViewPreviewProps {
  part: {
    state: "input-available" | "output-available" | "output-error" | string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
  };
  messageId: string;
  index: number;
  onSave: (toolCallId: string, viewData: GenerateViewArgs) => void;
  isSaving: boolean;
}

export function GenerateViewPreview({
  part,
  messageId,
  index,
  onSave,
  isSaving,
}: GenerateViewPreviewProps) {
  switch (part.state) {
    case "input-available":
      return (
        <div
          key={`${messageId}-part-${index}`}
          className="my-2 p-4 border rounded-lg bg-primary/5 border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2 text-primary font-medium">
            <Layout className="h-4 w-4" />
            <span>正在生成视图配置...</span>
          </div>
        </div>
      );
    case "output-available": {
      const output = part.output as GenerateViewOutput;

      if (!output.success) {
        return (
          <div
            key={`${messageId}-part-${index}`}
            className="text-destructive text-sm my-2 p-4 border rounded-lg bg-destructive/5 border-destructive/20"
          >
            Error: {output.message || "生成视图失败"}
          </div>
        );
      }

      const generateViewArgs = output.data;
      return (
        <div
          key={`${messageId}-part-${index}`}
          className="my-2 p-4 border rounded-lg bg-primary/5 border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2 text-primary font-medium">
            <Layout className="h-4 w-4" />
            <span>拟生成的视图配置</span>
          </div>
          <div className="space-y-1 mb-4 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">标题:</span>{" "}
              {generateViewArgs.title}
            </p>
            {generateViewArgs.description && (
              <p>
                <span className="font-semibold text-foreground">描述:</span>{" "}
                {generateViewArgs.description}
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">大小:</span>{" "}
              {generateViewArgs.layout_w} x {generateViewArgs.layout_h}
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() =>
              onSave(generateViewArgs.toolCallId, generateViewArgs)
            }
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            保存视图到仪表盘
          </Button>
        </div>
      );
    }
    case "output-error":
      return (
        <div
          key={`${messageId}-part-${index}`}
          className="text-destructive text-sm my-2"
        >
          Error: {part.errorText}
        </div>
      );
    default:
      return null;
  }
}
