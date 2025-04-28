import { ScheduleFormValues } from "@/schemas/scheduleCreateSchema";
import { useState } from "react";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScheduleCreateForm } from "@/components/schedule/ScheduleCreateForm";

interface ScheduleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduleFormValues) => Promise<void>;
  modelId: string;
  versionId: string;
}

const ScheduleCreateDialog = ({
  open,
  onOpenChange,
  onSubmit,
  modelId,
  versionId,
}: ScheduleCreateDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (values: ScheduleFormValues) => {
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
      title="新增排程日期"
      description={`請填寫 ${modelId} - ${versionId} 的排程日期`}
      footer={
        <Button
          type="submit"
          form="schedule-create-form"
          disabled={isSubmitting}
        >
          {showLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          建立排程
        </Button>
      }
    >
      <ScheduleCreateForm onSubmit={handleSubmit} />
    </BaseDialog>
  );
};

export default ScheduleCreateDialog;
