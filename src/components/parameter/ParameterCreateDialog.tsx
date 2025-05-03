"use client";

import { useRef, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";

import {
  ParameterCreateForm,
  ParameterCreateFormRef,
} from "@/components/parameter/ParameterCreateForm";
import { ParameterFormValues } from "@/schemas/parameterCreateSchema";
import { createParameters } from "@/lib/api/parameter/create";
import { ParameterFormData } from "@/types/form";
import { useAddParameter } from "@/hooks/parameter/parameter.hooks";
import { scrollToAnchor } from "@/lib/utils/common.helper";
import { clearVersionPrefillData } from "@/lib/utils/versionPrefill.helper";
import { ModelParameters } from "@/types/parameters";
import { wait } from "@/lib/utils/async.helper";

interface ParameterCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  version: string;
  prefillParams: ModelParameters | null;
}

const ParameterCreateDialog = ({
  open,
  onOpenChange,
  modelId,
  version,
  prefillParams,
}: ParameterCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const addParameter = useAddParameter();

  // 新增表單 formRef
  const formRef = useRef<ParameterCreateFormRef>(null);

  const handleSubmit = async (values: ParameterFormValues) => {
    setIsSubmitting(true);
    try {

      await wait(500);
      setShowLoading(true);

      const payload: ParameterFormData = {
        ...values,
        modelId: values.modelId,
        version: values.version,
      };

      const result = await createParameters(payload);

      addParameter(modelId, version, result);

      toast.success("參數設定成功！");

      await wait(500);
      onOpenChange(false);
      scrollToAnchor("param_view", 500);
    } catch (err) {
      console.error(err);
      toast.error("參數設定失敗，請稍後再試!");
    } finally {
      // 無論是否提交成功：
      setIsSubmitting(false);
      clearVersionPrefillData();
      formRef.current?.clearHighlightAndClearForm();
    }
  };

  const handleResetForm = () => {
    // 調用子元件 form 的 reset
    formRef.current?.resetForm(); // 這樣可以重設表單內容
    toast.success("已重設為預設參數");
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="新增參數設定"
      description={`請填寫 ${modelId} - ${version} 的初始參數`}
      footer={
        <div className="flex items-center justify-end gap-2">
          {/* 重設按鈕 */}
          <Button
            type="button"
            variant="outline"
            onClick={handleResetForm}
            disabled={isSubmitting}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重設表單
          </Button>

          {/* 提交按鈕 */}
          <Button
            type="submit"
            form="parameter-create-form"
            disabled={isSubmitting}
          >
            {isSubmitting && showLoading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            儲存參數
          </Button>
        </div>
      }
    >
      <ParameterCreateForm
        ref={formRef}
        onSubmit={handleSubmit}
        defaultValues={{
          modelId,
          version,
          ...(prefillParams || {}),
        }}
      />
    </BaseDialog>
  );
};

export default ParameterCreateDialog;
