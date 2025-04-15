"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useModelById } from "@/hooks/model/model.hooks";
import { useVersionContext } from "@/contexts/version/VersionContext";
import {
  useLatestVersionByModelId,
  fetchModelVersions,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";

import { ModelHeader } from "@/components/models/ModelHeader";
import { Card } from "@/components/ui/card";
import {
  SlidersHorizontal,
  GitCompare,
  ListChecks,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import { VersionCardListAccordion } from "@/components/debug/VersionCardListAccordion";

import { EmptyState } from "@/components/common/EmptyState";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const router = useRouter();
  const { dispatch } = useVersionContext();

  const model = useModelById(modelId);
  const latestVersion = useLatestVersionByModelId(modelId);

  const versions = useVersionsByModelId(modelId);

  const [openAccordion, setOpenAccordion] = useState(false);

  const [newlyCreatedVersion, setNewlyCreatedVersion] = useState<string | null>(
    null
  );

  // ✅ 建立 local loading 狀態模擬 500ms 載入時間
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // 初次開啟版本列表時懶加載
  useEffect(() => {
    if (openAccordion) {
      fetchModelVersions(modelId, dispatch);
    }
  }, [openAccordion, modelId, dispatch]);

  if (loading) {
    return (
      <div className="container max-w-5xl py-8 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!model) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-10 h-10" />}
        title="找不到模型資料"
        description="請確認模型 ID 是否正確，或返回模型清單重新選擇。"
        action={
          <Button onClick={() => router.push("/models")}>返回模型清單</Button>
        }
      />
    );
  }

  // 在 onClick 中這樣寫：
  const handleOpenVersionList = () => {
    setOpenAccordion(true); // 先展開
    setTimeout(() => {
      const anchor = document.getElementById("version-list");
      anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200); // 略為延遲，確保動畫開始
  };

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
      {/* ✅ 模型標題 */}
      <ModelHeader {...model} />

      {/* ✅ 導引卡片 */}
      <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
        <Image
          src="/model-guide.gif"
          alt="model-guide"
          width={200}
          height={200}
          className="rounded-md"
        />
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            這是你的模型操作主頁，您可以：
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>檢視最新版本與參數</li>
            <li>建立新版本並上傳模型</li>
            <li>比較各版本的參數與結果</li>
            <li>若尚未建立任何版本，請先從下方操作開始</li>
          </ul>
        </div>
      </Card>

      {/* ✅ 操作卡片四格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          icon={<SlidersHorizontal className="w-5 h-5" />}
          label="查看最新版本"
          onClick={() =>
            router.push(`/models/${modelId}/version/${latestVersion?.version}`)
          }
          disabled={!latestVersion}
        />
        <ActionCard
          icon={<ListChecks className="w-5 h-5" />}
          label="展開版本列表"
          onClick={handleOpenVersionList}
        />
        <ActionCard
          icon={<GitCompare className="w-5 h-5" />}
          label="比較版本"
          onClick={() => router.push(`/models/${modelId}/compare`)}
        />
        <ActionCard
          icon={<PlusCircle className="w-5 h-5" />}
          label="建立新版本"
          onClick={() => router.push(`/models/${modelId}/version/create`)}
        />
      </div>

      {/* ✅ 版本列表卡片區塊 */}
      <div id="version-list" className="pt-8">
        <VersionCardListAccordion
          modelId={modelId}
          versions={versions}
          openByDefault={openAccordion}
          newlyCreatedVersion={newlyCreatedVersion ?? undefined}
          onOpenChange={handleOpenVersionList}
        />
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Card
      onClick={!disabled ? onClick : undefined}
      className={`group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground group-hover:underline">
        {label}
      </span>
    </Card>
  );
}
