// components/version/VersionCardListAccordion.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { VersionCard } from "@/components/version/VersionCard";
import { ModelVersion } from "@/types/model";

import { useState, useEffect } from "react";
import { getSortedVersions } from "@/lib/utils/version.helper";

interface Props {
  modelId: string;
  versions: ModelVersion[];
  newlyCreatedVersion?: string; // ✅ optional: 高亮最近建立的版本
  openByDefault?: boolean;
  onOpenChange?: (open: boolean) => void; // ✅ 加入這個
}

export default function VersionCardListAccordion({
  modelId,
  versions,
  newlyCreatedVersion,
  openByDefault = false,
  onOpenChange,
}: Props) {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    openByDefault ? "versions" : undefined
  );

  // ✅ 若有新增版本，自動展開
  useEffect(() => {
    if (newlyCreatedVersion) {
      setAccordionValue("versions");
    }
  }, [newlyCreatedVersion]);

  // ✅ 若外部指定 openByDefault = true，初次掛載就展開（避免受控混亂）
  useEffect(() => {
    if (openByDefault) {
      setAccordionValue("versions");
    }
  }, [openByDefault]);

  const sortedVersions = getSortedVersions(versions, true);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={accordionValue}
      onValueChange={(val) => {
        setAccordionValue(val);
        onOpenChange?.(val === "versions"); // ✅ 回報目前是否展開
      }}
      disabled={versions.length === 0}
    >
      <AccordionItem value="versions">
        <AccordionTrigger className="text-base font-medium px-2">
          查看所有版本（{versions.length}）
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 px-2">
          {sortedVersions.map((v) => (
            <VersionCard
              key={v.version}
              modelId={modelId}
              version={v}
              highlight={v.version === newlyCreatedVersion}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
