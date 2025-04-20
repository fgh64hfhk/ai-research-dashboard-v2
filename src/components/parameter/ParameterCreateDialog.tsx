"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";

import { ParameterCreateForm } from "@/components/parameter/ParameterCreateForm";
import { ParameterFormValues } from "@/schemas/parameterCreateSchema";
import { createParameters } from "@/lib/api/parameter/create";
import { ParameterFormData } from "@/types/form";
import { useAddParameter } from "@/hooks/parameter/parameter.hooks";
import { scrollToAnchor } from "@/lib/utils/common.helper";

interface ParameterCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  version: string;
}

const ParameterCreateDialog = ({
  open,
  onOpenChange,
  modelId,
  version,
}: ParameterCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const addParameter = useAddParameter();

  const handleSubmit = async (values: ParameterFormValues) => {
    setIsSubmitting(true);

    try {
      // 模擬延遲才顯示 loading spinner
      setTimeout(() => setShowLoading(true), 100);

      const payload: ParameterFormData = {
        ...values,
        modelId: values.modelId,
        version: values.version,
      };

      const result = await createParameters(payload);

      addParameter(modelId, version, result);

      onOpenChange(false); // 關閉 dialog

      toast.success("參數設定成功！");

      scrollToAnchor("param_view", 500);
    } catch (err) {
      console.error(err);
      toast.error("參數設定失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
      setShowLoading(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="新增參數設定"
      description={`請填寫 ${modelId} - ${version} 的初始參數`}
      footer={
        <Button
          type="submit"
          form="parameter-create-form"
          disabled={isSubmitting}
        >
          {showLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          儲存參數
        </Button>
      }
    >
      <ParameterCreateForm
        onSubmit={handleSubmit}
        defaultValues={{
          modelId,
          version,
        }}
      />
    </BaseDialog>
  );
};

export default ParameterCreateDialog;