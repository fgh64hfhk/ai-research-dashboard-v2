"use client";

import { useParams } from "next/navigation";

import { useModelById } from "@/hooks/model/model.hooks";
import {
  useLatestVersionByModelId,
  useVersionLoading,
  fetchModelVersions,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";

import { ModelHeader } from "@/components/models/ModelHeader";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

import { VersionList } from "@/components/models/VersionList";
import { useVersionContext } from "@/contexts/version/VersionContext";

import { useState } from "react";

import { ModelActionPanel } from "@/components/models/ModelActionPanel";

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();

  const model = useModelById(modelId);
  const latestVersion = useLatestVersionByModelId(modelId);

  const versions = useVersionsByModelId(modelId);
  const isLoading = useVersionLoading(modelId);

  const { dispatch } = useVersionContext();

  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );
  const [toFetch, setToFetch] = useState(true);

  if (!model) {
    return (
      <p className="text-center text-muted-foreground py-12">
        找不到該模型，請確認模型 ID 是否正確。
      </p>
    );
  }

  const handleOpenVersions = () => {
    if (toFetch) {
      fetchModelVersions(modelId, dispatch);
      setToFetch(false);
    }
    if (!openAccordion) {
      setOpenAccordion("version-list");
    } else {
      setOpenAccordion(undefined);
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-8 space-y-6">
      {/* 模型標題與描述 */}
      <ModelHeader {...model} />

      {/* ✅ 操作區塊抽出成獨立元件 */}
      <ModelActionPanel
        modelId={modelId}
        latestVersion={latestVersion}
        onOpenVersions={handleOpenVersions}
      />

      {/* 懶加載版本列表區塊 */}
      <Accordion
        type="single"
        collapsible
        value={openAccordion} // 由我們控制目前展開哪個區塊
        onValueChange={setOpenAccordion} // 由 Accordion 回傳使用者互動，回寫 state
      >
        <AccordionItem value="version-list">
          <AccordionContent>
            <VersionList
              modelId={modelId}
              versions={versions}
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
