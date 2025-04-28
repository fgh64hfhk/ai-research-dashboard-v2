"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { ActionCard } from "@/components/common/ActionCard";

import { ScheduleInfoCard } from "@/components/schedule/ScheduleInfoCard";
import {
  useScheduleById,
  useScheduleStatus,
} from "@/hooks/schedule/schedule.hooks";
import { CalendarX, PlayCircle, RefreshCcw, Settings2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { startMockTrainingSocket } from "@/mock/socketMock";
import { useTrainingSocket } from "@/hooks/socket/useTrainingSocket";
import { TrainingProgressCard } from "@/components/schedule/TrainingProgressCard";
import { scrollToAnchor } from "@/lib/utils/common.helper";
import { generateMockTrainingResult } from "@/lib/mock/result.mock";
import { TrainingResult } from "@/types/training";
import {
  useTrainingResultCreate,
  useTrainingResultsByVersionKey,
} from "@/hooks/training/results.hooks";
import { TrainingResultItem } from "@/components/schedule/TrainingResultItem";
import { PageLoader } from "@/components/common/PageLoader";

import { toast } from "sonner";
import { ScheduleDetailSkeleton, ScheduleHeader } from "@/components/schedule";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { useModelById } from "@/hooks/model/model.hooks";

export default function ScheduleDetailPage() {
  // 路由模組
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const router = useRouter();

  // 資料初始化
  const schedule = useScheduleById(scheduleId);
  const modelId = schedule?.modelId;
  const model = useModelById(modelId || "");
  const versionId = schedule?.version;
  const trainingResult = useTrainingResultsByVersionKey(
    schedule?.scheduleId || ""
  );
  const isLoading = useLoadingGuard(800);

  // 啟動訓練的模組
  const changeStatus = useScheduleStatus();
  const [runningScheduleId, setRunningScheduleId] = useState<string | null>(
    null
  );

  // 判斷此訓練排程是否認可自動訓練
  useEffect(() => {
    if (schedule?.triggerTraining && schedule.status === "running") {
      setRunningScheduleId(schedule.scheduleId);
    }
  }, [schedule]);

  const isRunning = schedule?.status === "running" && !!runningScheduleId;

  // 根據 ID 建立「模擬 server」與「模擬 client」雙向 socket 溝通
  useEffect(() => {
    if (runningScheduleId) {
      startMockTrainingSocket(runningScheduleId);
    }
  }, [runningScheduleId]);
  // 根據 running schedule id 啟動客戶端的 socket 請求
  const { progress, connected, isCompleted, setIsCompleted, error } =
    useTrainingSocket(runningScheduleId || "");

  // 訓練結果模組
  const addResult = useTrainingResultCreate();
  // 當訓練完成後，將結果與狀態回寫到全域狀態
  useEffect(() => {
    if (isCompleted && runningScheduleId) {
      const generated = generateMockTrainingResult({
        scheduleId: runningScheduleId,
        modelId: modelId || "",
        version: versionId || "",
      });

      const result: Record<string, TrainingResult[]> = {
        [runningScheduleId]: [generated],
      };

      // 更新狀態與結果
      addResult(result);

      // 顯示成功或失敗的提示
      if (generated.status === "completed") {
        changeStatus(runningScheduleId, "completed");
        toast.success("模擬訓練完成 ✅", {
          action: {
            label: "查看結果",
            onClick: () => console.log("跳轉到結果詳細頁面"),
          },
        });
      } else {
        changeStatus(runningScheduleId, "failed");
        toast.error("模擬訓練失敗 ⚠️", {
          description: generated.message || "請稍後再試或檢查訓練參數。",
        });
      }

      setIsCompleted(false);
    }
  }, [
    isCompleted,
    runningScheduleId,
    setIsCompleted,
    modelId,
    versionId,
    changeStatus,
    addResult,
    error,
  ]);

  // 按鈕啟用的條件邏輯（抽象）
  const actionType = schedule?.status === "scheduled" ? "success" : "default";

  const isStartable = schedule?.status === "scheduled";

  const isReschedule =
    schedule?.status === "completed" || schedule?.status === "failed";

  return (
    <PageLoader isLoading={isLoading} fallback={<ScheduleDetailSkeleton />}>
      {/* 🧭 區塊一：使用者引導說明卡片 */}
      <PageIntroCard
        imageSrc="/guide/Data extraction schedule.gif"
        title="這是排程的詳細頁面，你可以："
        descriptionList={[
          "檢視排程的執行時間與任務狀態",
          "若尚未執行，可修改時間或取消任務",
          "訓練完成後，可查看訓練結果與紀錄",
          "若任務失敗，可重新安排排程",
        ]}
      />

      {/* 🧭 區塊二：標題與狀態 */}
      <ScheduleHeader
        modelName={model?.name || ""}
        version={versionId || ""}
        status={schedule?.status || ""}
        scheduledAt={schedule?.runDate || ""}
      />
      {/* 🧭 區塊三：排程詳情（關聯模型版本 / 時間 / 類型 等）*/}
      {schedule ? (
        <ScheduleInfoCard {...schedule} />
      ) : (
        <EmptyState
          icon={<CalendarX className="w-10 h-10 text-muted-foreground" />}
          title="找不到排程資料"
          description="請確認排程 ID 是否正確，或返回模型頁面重新操作。"
          action={
            <Button variant="outline" onClick={() => router.push("/models")}>
              返回模型列表
            </Button>
          }
        />
      )}

      {/* ✅ 區塊四：操作按鈕 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<PlayCircle className="w-5 h-5" />}
          label="開始訓練"
          onClick={() => {
            changeStatus(scheduleId, "running");
            scrollToAnchor("progress_view", 200);
          }}
          variant={actionType}
          disabled={!isStartable}
        />
        <ActionCard
          icon={<RefreshCcw className="w-5 h-5" />}
          label="重新排程"
          onClick={() => console.log("Reschedule")}
          disabled={!isReschedule}
        />
        <ActionCard
          icon={<Settings2 className="w-5 h-5" />}
          label="編輯排程"
          onClick={() => console.log("Edit schedule")}
          disabled={true}
        />
      </div>

      {/* 🧭 區塊五：最新訓練結果摘要（可整合 TrainingResultCard） */}
      {isRunning && !isCompleted ? (
        <TrainingProgressCard progress={progress} connected={connected} />
      ) : trainingResult?.length !== 0 ? (
        <TrainingResultItem result={trainingResult[0]} />
      ) : (
        <EmptyState
          icon={<PlayCircle className="w-10 h-10 text-muted-foreground" />}
          title="尚無訓練結果"
          description="此排程尚未執行，點擊下方的「開始訓練」按鈕即可執行任務，並在完成後查看結果。"
          action={
            <Button onClick={() => changeStatus(scheduleId, "running")}>
              <PlayCircle className="w-4 h-4 mr-2" />
              開始訓練
            </Button>
          }
        />
      )}
    </PageLoader>
  );
}
