"use client";

import { BaseDialog } from "@/components/common/BaseDialog";
import { VersionActivateForm } from "@/components/version/VersionActivateForm";
import { VersionActivateFormValues } from "@/schemas/versionActivateSchema";
import { GenerateMode } from "@/types/model";

interface VersionActivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  defaultValues: VersionActivateFormValues;
  mode: GenerateMode;
  onSubmit: (data: VersionActivateFormValues, mode: GenerateMode) => void;
}

export function VersionActivateDialog({
  open,
  onOpenChange,
  modelId,
  defaultValues,
  mode,
  onSubmit,
}: VersionActivateDialogProps) {
  // 🧠 自動切換對話匡內容
  const isInitial = mode === "initialActivation";

  const title = isInitial
    ? "建立第二版本（激活比較功能）"
    : "建立新版本（基於比較結果優化）";

  const description = isInitial
    ? "此版本將作為模型版本比較的起點，請確認資訊無誤後建立。"
    : "請根據比較分析結果，建立優化後的新版本。建議合理修改描述與類型。";

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <VersionActivateForm
        modelId={modelId}
        defaultValues={defaultValues}
        onSubmit={(data) => {
          onSubmit(data, mode);
          onOpenChange(false); // 送出後自動關閉 Dialog
        }}
        mode={mode} // 傳給表單，讓表單也可以根據 mode 控制
      />
    </BaseDialog>
  );
}
