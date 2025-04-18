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

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { AlertCircle } from "lucide-react";

import { VersionFormValues } from "@/schemas/versionCreateSchema";
import { VersionFormData } from "@/types/form";
import { createVersion } from "@/lib/api/version/create";
import { toast } from "sonner";
import { VersionCreateDialog } from "@/components/version/VersionCreateDialog";

import { useIncompleteParams } from "@/hooks/useIncompleteParams";
import { ModelActionPanel } from "@/components/models/ModelActionPanel";
import { scrollToAnchor } from "@/lib/utils/common.helper";
import { IntroCard } from "@/components/common/IntroCard";

export default function ModelDetailPage() {
  // 路由模組
  const { modelId } = useParams<{ modelId: string }>();
  const router = useRouter();

  // 懶加載模組
  const { dispatch } = useVersionContext();
  const [fetched, setFetched] = useState(false);

  // 新增版本模組
  const addVersion = useAddVersion();
  const { markIncomplete } = useIncompleteParams();
  const [openDialog, setOpenDialog] = useState(false);

  // 初始化資料
  const model = useModelById(modelId);
  const latestVersion = useLatestVersionByModelId(modelId);
  const versions = useVersionsByModelId(modelId);

  // 確認版本是否有參數表與排程設定
  const { isParamMissing, isScheduleMissing } = useCheckVersionComplete(
    modelId,
    latestVersion?.version || ""
  );

  // 下拉區塊模組
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

  const handleOpenVersionList = (open: boolean) => {
    setOpenAccordion(open);
    scrollToAnchor("version-list", 200);
  };

  const handleOnVersionDetailPage = (modelId: string, versionId: string) => {
    router.push(`/models/${modelId}/version/${versionId}`);
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
          onClick: () => handleOnVersionDetailPage(modelId, result.version),
        },
      });

      scrollToAnchor("version-list", 200);

      // ✅ 高亮新版本
      setNewlyCreatedVersion(result.version);

      // 關閉視窗
      setOpenDialog(false);
    } catch (err) {
      toast.error("版本建立失敗，請稍後再試");
      console.error(err);
    }
  };

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      {/* ✅ 導引卡片 */}
      <IntroCard
        imageSrc="/guide/Artificial intelligence.gif"
        title="這是你的模型操作主頁，您可以："
        descriptionList={[
          "檢視最新版本與參數",
          "建立新版本並上傳模型",
          "比較各版本的參數與結果",
          "若尚未建立任何版本，請先從下方操作開始",
        ]}
      />

      {/* ✅ 模型標題 */}
      <ModelHeader {...model} />

      {/* ✅ 操作卡片四格 */}
      <ModelActionPanel
        isLatestVersion={!latestVersion}
        isVersionList={versions.length === 0}
        isParameterIncomplete={isParamMissing}
        isScheduleIncomplete={isScheduleMissing}
        onLatestVersionPage={() =>
          handleOnVersionDetailPage(modelId, latestVersion?.version || "")
        }
        onVersionList={() => handleOpenVersionList(true)}
        onOpenCreateVersionDialog={() => setOpenDialog(true)}
      />

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
