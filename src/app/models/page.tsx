"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModelList } from "@/hooks/model/model.hooks"; // 模型列表 hook

import { IntroCard } from "@/components/common/IntroCard";
import { ModelsActionPanel } from "@/components/models_page/ModelsActionPanel";

export default function ModelListPage() {
  const router = useRouter();
  const models = useModelList();

  const hasModels = models.length > 0;

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      {/* ✅ 區塊一：首頁引導說明卡片 */}

      <IntroCard
        title="歡迎使用 AI 模型管理平台 👋"
        descriptionList={[
          "瀏覽所有模型與版本資訊",
          "建立新模型並進行訓練規劃",
          "快速切換與比較多個版本",
        ]}
      />

      {/* ✅ 區塊二：四格動作卡片區塊 */}
      <ModelsActionPanel />

      {/* ✅ 區塊三：模型清單（卡片列表） */}
      {hasModels ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card
              key={model.modelId}
              onClick={() => router.push(`/models/${model.modelId}`)}
              className="cursor-pointer hover:shadow-md transition p-4 space-y-2"
            >
              <h3 className="font-bold text-lg">{model.name}</h3>
              <p className="text-sm text-muted-foreground">
                {model.description}
              </p>
              <p className="text-xs text-muted-foreground">
                語言：{model.language}
              </p>
              {/* 可加上 version badge / 未完成提示 */}
            </Card>
          ))}
        </div>
      ) : (
        // ✅ 區塊四：空狀態提醒（若 models 為空）
        <div className="text-center text-muted-foreground py-12 space-y-2">
          <AlertCircle className="mx-auto w-10 h-10 text-yellow-500" />
          <p className="text-base font-medium">尚未建立任何模型</p>
          <p className="text-sm">請點擊上方按鈕建立新的模型以開始使用。</p>
        </div>
      )}
    </div>
  );
}
