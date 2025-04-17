"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useVersionContext } from "@/contexts/version/VersionContext";

import { useModelById } from "@/hooks/model/model.hooks";
import {
  useLatestVersionByModelId,
  fetchModelVersions,
  useVersionsByModelId,
  useAddVersion,
  useCheckVersionComplete,
} from "@/hooks/version/version.hooks";

import { ModelHeader } from "@/components/models/ModelHeader";
import { VersionCardListAccordion } from "@/components/models/VersionCardListAccordion";

import { EmptyState } from "@/components/common/EmptyState";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  SlidersHorizontal,
  GitCompare,
  ListChecks,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

import Image from "next/image";
import { VersionFormValues } from "@/schemas/versionCreateSchema";
import { VersionFormData } from "@/types/form";
import { createVersion } from "@/lib/api/version/create";
import { toast } from "sonner";
import { VersionCreateDialog } from "@/components/version/VersionCreateDialog";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIncompleteParams } from "@/hooks/useIncompleteParams";

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const router = useRouter();

  const { dispatch } = useVersionContext();

  const addVersion = useAddVersion(); // 取得 dispatch 函式

  const model = useModelById(modelId);
  const latestVersion = useLatestVersionByModelId(modelId);
  const { isParamMissing } = useCheckVersionComplete(modelId, latestVersion?.version || "");
  const { markIncomplete } = useIncompleteParams();

  const versions = useVersionsByModelId(modelId);

  const [openAccordion, setOpenAccordion] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [newlyCreatedVersion, setNewlyCreatedVersion] = useState<string | null>(
    null
  );

  const [fetched, setFetched] = useState(false);

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
    if (openAccordion && !fetched) {
      fetchModelVersions(modelId, dispatch);
      setFetched(true);
    }
  }, [openAccordion, fetched, modelId, dispatch]);

  if (loading) {
    return (
      <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
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
  const handleOpenVersionList = (open: boolean) => {
    setOpenAccordion(open); // 先展開
    setTimeout(() => {
      const anchor = document.getElementById("version-list");
      anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200); // 略為延遲，確保動畫開始
  };

  const handleSubmit = async (formData: VersionFormValues) => {
    try {
      const payload: VersionFormData = {
        modelId,
        version: formData.version,
        modifiedType: formData.modifiedType,
        modelFile: formData.modelFile,

        buildDate: new Date("2025-04-10").toISOString(),
        trainingTime: 0,
        status: "inactive",
      };

      const result = await createVersion(payload);
      // 模擬串接 API 得到提交結果，因此相當於已連接
      setFetched(true);

      // ✅ 加入版本到全域狀態
      addVersion(modelId, result);

      // ✅ 標記該版本參數尚未設定
      const versionKey = `${modelId}_${result.version}`;
      markIncomplete(versionKey);

      toast.success(`版本 ${result.version} 建立成功！`, {
        action: {
          label: "前往設定參數",
          onClick: () =>
            router.push(`/models/${modelId}/version/${result.version}`),
        },
      });

      setTimeout(() => {
        const anchor = document.getElementById("version-list");
        anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200); // 略為延遲，確保動畫開始

      // ✅ 高亮新版本
      setNewlyCreatedVersion(result.version);
    } catch (err) {
      toast.error("版本建立失敗，請稍後再試");
      console.error(err);
    }
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
          priority={true}
          unoptimized
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ActionCard
                  icon={<SlidersHorizontal className="w-5 h-5" />}
                  label="查看最新版本"
                  onClick={() =>
                    router.push(
                      `/models/${modelId}/version/${latestVersion?.version}`
                    )
                  }
                  disabled={!latestVersion}
                  className={cn(
                    isParamMissing && "bg-green-50 hover:bg-green-100"
                  )}
                />
              </div>
            </TooltipTrigger>
            {versions.length !== 0 && isParamMissing && (
              <TooltipContent>
                <p className="text-sm font-medium">最新版本尚未完成參數設定</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <ActionCard
          icon={<ListChecks className="w-5 h-5" />}
          label="展開版本列表"
          onClick={() => handleOpenVersionList(true)}
          disabled={versions.length === 0}
        />
        <ActionCard
          icon={<GitCompare className="w-5 h-5" />}
          label="比較版本"
          onClick={() => router.push(`/models/${modelId}/compare`)}
        />
        <ActionCard
          icon={<PlusCircle className="w-5 h-5" />}
          label="建立新版本"
          onClick={() => setOpenDialog(true)}
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

      <VersionCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        modelId={modelId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
  disabled,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Card
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full",
          className ? "bg-green-100" : "bg-muted"
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground group-hover:underline">
        {label}
      </span>
    </Card>
  );
}
