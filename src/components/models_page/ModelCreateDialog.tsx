"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/common/BaseDialog";
import { ModelCreateForm } from "@/components/models_page/ModelCreateForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ModelFormValues } from "@/schemas/modelCreateSchema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ModelFormValues) => Promise<void>;
}

export const ModelCreateDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (values: ModelFormValues) => {
    setIsSubmitting(true);

    try {
      // 模擬延遲才顯示 loading spinner
      setTimeout(() => setShowLoading(true), 100);
      await onSubmit(values);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setShowLoading(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="新增模型"
      description="請填寫模型基本資訊，作為建立模型分組的依據。"
      footer={
        <Button type="submit" form="model-create-form" disabled={isSubmitting}>
          {showLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          建立模型
        </Button>
      }
    >
      <ModelCreateForm onSubmit={handleSubmit} />
    </BaseDialog>
  );
};
