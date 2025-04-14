"use client";

import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";

import { VersionCreateForm } from "./VersionCreateForm";
import { VersionFormValues } from "@/schemas/versionCreateSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface VersionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  onSubmit: (data: VersionFormValues) => void;
}

export const VersionCreateDialog = ({
  open,
  onOpenChange,
  modelId,
  onSubmit,
}: VersionCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (values: VersionFormValues) => {
    setIsSubmitting(true);

    try {
      // 延遲 1 秒才顯示 spinner，避免太快閃一下影響體驗
      setTimeout(() => {
        setShowLoading(true);
      }, 1000);

      await onSubmit(values);

      // 模擬延遲後結束（可改為 props 控制關閉）
      await new Promise((res) => setTimeout(res, 5000));
    } catch (err) {
      console.error("版本建立失敗：", err);
    } finally {
      setIsSubmitting(false);
      setShowLoading(false);
    }
  };
  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`建立 ${modelId.toUpperCase()} 的初始版本`}
      description="請填寫下列資訊來建立新版本，包括修改摘要、初始參數設定與模型檔案上傳。"
      footer={
        <Button
          type="submit"
          form="version-create-form"
          disabled={isSubmitting}
        >
          {showLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          建立版本
        </Button>
      }
    >
      <VersionCreateForm
        modelId={modelId}
        onSubmit={handleSubmit}
        onDone={() => {
          onOpenChange(false);
        }}
      />
    </BaseDialog>
  );
};
