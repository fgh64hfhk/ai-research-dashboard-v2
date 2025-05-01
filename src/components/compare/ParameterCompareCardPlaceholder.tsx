"use client";

import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface ParameterCompareCardPlaceholderProps {
  message?: string;
  actionLabel?: string;
  onClick?: () => void;
}

export default function ParameterCompareCardPlaceholder({
  message = "尚無比較版本",
  actionLabel = "建立新版本",
  onClick,
}: ParameterCompareCardPlaceholderProps) {
  return (
    <Card
      className="flex flex-col items-center justify-center p-6 gap-4 border-dashed border-2 border-muted-foreground/30 bg-muted/30 h-full min-h-[200px] cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <PlusCircle className="w-8 h-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onClick && (
        <button className="text-sm font-semibold text-primary underline hover:text-primary/80">
          {actionLabel}
        </button>
      )}
    </Card>
  );
}
