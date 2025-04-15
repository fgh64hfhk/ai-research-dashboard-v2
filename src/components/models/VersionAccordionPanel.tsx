"use client";

import { useEffect, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModelVersion } from "@/types/model";
import { VersionCard } from "@/components/debug/VersionCard";

interface VersionAccordionPanelProps {
  versions: ModelVersion[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightVersionId?: string; // 用於建立新版本後高亮
  modelId: string;
  isLoading?: boolean;
}

export const VersionAccordionPanel = ({
  versions,
  open,
  onOpenChange,
  highlightVersionId,
  modelId,
}: VersionAccordionPanelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  return (
    <div ref={containerRef} className="pt-6">
      <Accordion
        type="single"
        value={open ? "version-list" : undefined}
        onValueChange={(v) => onOpenChange(v === "version-list")}
      >
        <AccordionItem value="version-list">
          <AccordionTrigger className="text-base font-medium">
            所有版本紀錄
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">尚無版本資料</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {versions.map((version) => (
                  <VersionCard
                    key={version.version}
                    modelId={modelId}
                    version={version}
                    highlight={version.version === highlightVersionId}
                  />
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
