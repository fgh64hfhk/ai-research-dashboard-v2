"use client";

import { useState } from "react";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { useModelCreate, useModelList } from "@/hooks/model/model.hooks";

import {
  ModelCardList,
  ModelCreateDialog,
  ModelsActionPanel,
} from "@/components/model";

import { PageLoader } from "@/components/common/PageLoader";
import { EmptyState } from "@/components/common/EmptyState";

import { PageIntroCard } from "@/components/guidance/PageIntroCard";

import { Layers } from "lucide-react";

import { ModelFormValues } from "@/schemas/modelCreateSchema";
import { ModelFormData } from "@/types/form";

import { v4 as uuidv4 } from "uuid";
import { createModel } from "@/lib/api/model/create";
import { scrollToAnchor } from "@/lib/utils/common.helper";

import { toast } from "sonner";
import ModelListSkeleton from "@/components/model/ModelListSkeleton";

export default function ModelListPage() {
  // 初始化資料
  const models = useModelList();
  const hasModels = models.length > 0;
  const isLoading = useLoadingGuard(500);

  // 新增模型模組
  const addModel = useModelCreate();
  const [openDialog, setOpenDialog] = useState(false);

  // 提交新增模型的串接函數
  const handleSubmit = async (formData: ModelFormValues) => {
    try {
      // 補齊上傳資料
      const payload: ModelFormData = {
        modelId: uuidv4(),
        modelName: formData.modelName,
        language: formData.language,
        description: formData.description,
      };

      // 模擬串接 API 得到提交結果
      const result = await createModel(payload);

      // 加入模型到全域狀態
      addModel(result);

      // 跳出通知
      toast.success(`模型 ${result.name} 建立成功！`, {
        action: {
          label: "前往模型管理頁面",
          onClick: () => {},
        },
      });

      // 自動滾動到列表區塊
      scrollToAnchor("models", 200);

      // 關閉視窗
      setOpenDialog(false);
    } catch (err) {
      toast.error("模型建立失敗，請稍後再試");
      console.error(err);
    }
  };

  return (
    <PageLoader isLoading={isLoading} fallback={<ModelListSkeleton />}>
      {/* ✅ 區塊一：首頁引導說明卡片 */}
      <PageIntroCard
        title="歡迎使用 AI 模型管理平台 👋"
        descriptionList={[
          "瀏覽所有模型與版本資訊",
          "建立新模型並進行訓練規劃",
          "快速切換與比較多個版本",
        ]}
      />

      {/* ✅ 區塊二：四格動作卡片區塊 */}
      <ModelsActionPanel onOpenCreateDialog={() => setOpenDialog(true)} />

      {/* ✅ 區塊三：模型清單（卡片列表） */}
      {hasModels ? (
        <ModelCardList models={models} />
      ) : (
        // ✅ 區塊四：空狀態提醒（若 models 為空）
        <EmptyState
          icon={<Layers className="w-10 h-10 text-yellow-500" />}
          title="尚無模型"
          description="目前沒有任何模型資料，請點擊按鈕新增。"
        />
      )}

      {/* 區塊五：新增模型的對話匡 */}
      <ModelCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSubmit}
      />
    </PageLoader>
  );
}
