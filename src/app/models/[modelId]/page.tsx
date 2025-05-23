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
import { useIncompleteParams } from "@/hooks/parameter/useIncompleteParams";
import { useLoadingGuard } from "@/hooks/useLoadingGuard";

import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { PageLoader } from "@/components/common/PageLoader";
import { EmptyState } from "@/components/common/EmptyState";

import { ModelHeader } from "@/components/model/ModelHeader";
import { ModelActionPanel } from "@/components/model/ModelActionPanel";
import { ModelDetailSkeleton } from "@/components/model/ModelDetailSkeleton";

import {
  VersionCardListAccordion,
  VersionCreateDialog,
} from "@/components/version";

import { Button } from "@/components/ui/button";

import { AlertCircle } from "lucide-react";

import { VersionFormValues } from "@/schemas/versionCreateSchema";
import { VersionFormData } from "@/types/form";

import { createVersion } from "@/lib/api/version/create";
import { scrollToAnchor } from "@/lib/utils/common.helper";
import { toast } from "sonner";
import { getModelStageFromData } from "@/lib/utils/model.helper";
import { useLatestTrainingStatus } from "@/hooks/trainingResult/results.hooks";

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
  const isLoading = useLoadingGuard(1200);

  // 確認版本是否有參數表與排程設定
  const { isParamMissing, isScheduleMissing } = useCheckVersionComplete(
    modelId,
    latestVersion?.version || ""
  );

  const { hasCompletedTraining } = useLatestTrainingStatus(
    modelId,
    latestVersion?.version || ""
  );

  // 確定模型狀態
  const modelStage = latestVersion
    ? getModelStageFromData({
        latestVersion,
        versions,
        isParamMissing,
        isScheduleMissing,
        hasCompletedTraining,
      })
    : "noVersion";

  // 下拉區塊模組
  const [openAccordion, setOpenAccordion] = useState(false);
  const [newlyCreatedVersion, setNewlyCreatedVersion] = useState<string | null>(
    null
  );

  // 初次開啟版本列表時懶加載
  useEffect(() => {
    if (openAccordion && !fetched) {
      fetchModelVersions(modelId, dispatch);
      setFetched(true);
    }
  }, [openAccordion, fetched, modelId, dispatch]);

  const handleOpenVersionList = (open: boolean) => {
    setOpenAccordion(open);
    scrollToAnchor("version-list", 200);
  };

  const handleVersionDetailPage = (modelId: string, versionId: string) => {
    router.push(`/models/${modelId}/version/${versionId}`);
  };

  const handleComparePage = (modelId: string) => {
    router.push(`/models/${modelId}/compare`);
  };

  const handleBackToModelList = () => {
    router.push("/models");
  };

  const handleSubmit = async (formData: VersionFormValues) => {
    try {
      const payload: VersionFormData = {
        modelId,
        version: formData.version,
        modifiedType: formData.modifiedType,
        modelFile: formData.modelFile,

        buildDate: new Date("2025-04-30").toISOString(),
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
          onClick: () => handleVersionDetailPage(modelId, result.version),
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
    <PageLoader isLoading={isLoading} fallback={<ModelDetailSkeleton />}>
      {/* ✅ 導引卡片 */}
      <PageIntroCard
        imageSrc="/guide/Artificial intelligence.gif"
        title="這是你的模型操作主頁，你可以："
        descriptionList={[
          "檢視最新版本與參數",
          "建立新版本並上傳檔案",
          "比較各版本的參數與結果",
          "若尚未建立任何版本，請先從下方操作開始",
        ]}
      />

      {/* ✅ 模型標題 */}
      {model ? (
        <ModelHeader {...model} />
      ) : (
        <EmptyState
          icon={<AlertCircle className="w-10 h-10" />}
          title="找不到模型資料"
          description="請確認模型 ID 是否正確，或返回模型清單重新選擇。"
          action={
            <Button onClick={() => router.push("/models")}>返回模型清單</Button>
          }
        />
      )}

      {/* ✅ 操作卡片四格 */}
      <ModelActionPanel
        modelStage={modelStage}
        isLatestVersion={!!latestVersion}
        isVersionList={versions.length === 0}
        isParameterIncomplete={isParamMissing}
        isScheduleIncomplete={isScheduleMissing}
        onLatestVersionPage={() =>
          handleVersionDetailPage(modelId, latestVersion?.version || "")
        }
        onVersionList={() => handleOpenVersionList(true)}
        onVersionComparePage={() => handleComparePage(modelId)}
        onOpenCreateVersionDialog={() => setOpenDialog(true)}
        onBackToModelList={handleBackToModelList}
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
    </PageLoader>
  );
}
