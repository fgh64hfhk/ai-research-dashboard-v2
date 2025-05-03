"use client";

import { BaseDialog } from "@/components/common/BaseDialog";
import { VersionActivateForm } from "@/components/version/VersionActivateForm";
import { VersionActivateFormValues } from "@/schemas/versionActivateSchema";

interface VersionActivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  defaultValues: VersionActivateFormValues;
  onSubmit: (data: VersionActivateFormValues) => void;
}

export function VersionActivateDialog({
  open,
  onOpenChange,
  modelId,
  defaultValues,
  onSubmit,
}: VersionActivateDialogProps) {
  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="建立新版本（激活比較功能）"
      description="此版本將作為模型版本比較的起點，請確認資訊無誤後建立。"
    >
      <VersionActivateForm
        modelId={modelId}
        defaultValues={defaultValues}
        onSubmit={(data) => {
          onSubmit(data);
          onOpenChange(false); // 送出後自動關閉 Dialog
        }}
      />
    </BaseDialog>
  );
}