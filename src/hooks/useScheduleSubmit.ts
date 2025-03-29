import { useScheduleContext } from "@/contexts/ScheduleContext";
import { ScheduleFormValues } from "@/schemas/scheduleSchema";

import { createSchedule } from "@/lib/api/schedule";
import { SchedulePayload, TrainingSchedule } from "@/types/schedule";

import { useState } from "react";
import { useToastNotify } from "@/hooks/useToastNotify";

import { useRouter } from "next/navigation";

export const useScheduleSubmit = () => {
  const { dispatch } = useScheduleContext();
  const [loading, setLoading] = useState(false);

  const { success: toastSuccess, error: toastError } = useToastNotify();

  const router = useRouter();

  const submitSchedule = async (formData: ScheduleFormValues) => {
    setLoading(true);

    try {
      // 1. 準備 payload 根據前端欄位結構轉換
      const payload: SchedulePayload = {
        modelId: formData.modelId,
        version: formData.version,
        buildDate: formData.buildDate,
        runDate: formData.runDate,
        triggerTraining: formData.triggerTraining ?? false,
      };
      // 2. 呼叫 mock API
      const response = await createSchedule(payload);

      // 3. 組合完整的排程資料，符合 TrainingSchedule 型別
      const newSchedule: TrainingSchedule = {
        id: response.id,
        modelId: payload.modelId,
        version: payload.version,
        buildDate: payload.buildDate,
        runDate: payload.runDate,
        status: response.status,
        createdAt: response.createdAt,
      };

      // 4. 觸發 dispatch 更新全域狀態
      dispatch({
        type: "ADD_SCHEDULE",
        payload: newSchedule,
      });

      // ✅ 使用封裝的通知函式
      toastSuccess("排程建立成功！", "查看任務", () =>
        router.push(`/schedule/${newSchedule.id}`)
      );

      // 5. 可選：回傳結果給外部元件處理 例如：關閉對話匡以及顯示成功通知
      return { success: true, data: newSchedule };
    } catch (error: any) {
      // ⚠️ 使用封裝的通知函式
      toastError(error?.message || "排程建立失敗");

      return { success: false, error: error?.message || "排程建立失敗" };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitSchedule,
    loading,
  };
};
