"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/PageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ActionCard } from "@/components/common/ActionCard";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { ScheduleDetailSkeleton, ScheduleHeader } from "@/components/schedule";
import { ScheduleInfoCard } from "@/components/schedule/ScheduleInfoCard";
import { TrainingProgressCard } from "@/components/schedule/TrainingProgressCard";
import { TrainingResultItem } from "@/components/schedule/TrainingResultItem";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { useModelById } from "@/hooks/model/model.hooks";
import {
  useScheduleById,
  useScheduleStatus,
} from "@/hooks/schedule/schedule.hooks";
import { useTrainingSocket } from "@/hooks/socket/useTrainingSocket";
import {
  useTrainingResultCreate,
  useTrainingResultsByVersionKey,
} from "@/hooks/trainingResult/results.hooks";

import { startMockTrainingSocket } from "@/mock/socketMock";

import { scrollToAnchor } from "@/lib/utils/common.helper";
import { generateMockTrainingResult } from "@/lib/mock/result.mock";

import {
  CalendarX,
  GitCompare,
  PlayCircle,
  RefreshCcw,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";

export default function ScheduleDetailPage() {
  // 路由模組
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const router = useRouter();

  // 資料初始化
  const schedule = useScheduleById(scheduleId);
  const modelId = schedule?.modelId || "";
  const versionId = schedule?.version || "";

  const model = useModelById(modelId);

  const stableKey = useMemo(() => {
    if (!scheduleId) return "";
    return `${modelId}_${versionId}_${scheduleId}`;
  }, [modelId, versionId, scheduleId]);

  const trainingResults = useTrainingResultsByVersionKey(stableKey);
  const isLoading = useLoadingGuard(500);

  const [starting, setStarting] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const [running, setRunning] = useState(false);

  // 啟動訓練的模組
  const [runningScheduleId, setRunningScheduleId] = useState<string | null>(
    null
  );
  const changeStatus = useScheduleStatus();

  // 第一步驟：監聽是否登入啟動訓練的排程
  useEffect(() => {
    if (!schedule) return;

    const { triggerTraining, status, scheduleId } = schedule;

    if (triggerTraining && status === "running") {
      setRunningScheduleId(scheduleId);
      setRunning(true);
    }
  }, [
    schedule?.triggerTraining,
    schedule?.status,
    schedule?.scheduleId,
    schedule,
  ]);

  // 根據 ID 建立「模擬 server」與「模擬 client」雙向 socket 溝通
  useEffect(() => {
    if (!running || !runningScheduleId) return;

    startMockTrainingSocket(runningScheduleId);
  }, [runningScheduleId, running]);

  // 根據 running schedule id 啟動客戶端的 socket 請求
  const { progress, connected, isCompleted, isInitializing, setIsCompleted } =
    useTrainingSocket(runningScheduleId, running);

  // 根據訓練是否完成切換狀態
  useEffect(() => {
    if (!isCompleted) return;

    setRunning(false);

    if (starting) {
      setStarting(false);
    }

    if (retraining) {
      setRetraining(false);
    }
  }, [isCompleted, starting, retraining]);

  // 訓練結果模組
  const addResult = useTrainingResultCreate();

  // 當訓練完成後，將結果與狀態回寫到全域狀態
  useEffect(() => {
    if (!isCompleted || !runningScheduleId) return;

    const handleTrainingComplete = async () => {
      try {
        const generated = generateMockTrainingResult({
          scheduleId: runningScheduleId,
          modelId: modelId || "",
          version: versionId || "",
        });

        const key = `${modelId}_${versionId}_${runningScheduleId}`;

        // 更新狀態與結果
        addResult(key, generated);

        // 顯示成功或失敗的提示
        if (generated.status === "completed") {
          changeStatus(runningScheduleId, "completed");
          toast.success("模擬訓練完成 ✅", {
            action: {
              label: "查看結果",
              onClick: () => scrollToAnchor("result_view", 200),
            },
          });
        } else {
          changeStatus(runningScheduleId, "failed");
          toast.error("模擬訓練失敗 ⚠️", {
            description: generated.message || "請稍後再試或檢查訓練參數。",
            action: {
              label: "檢查錯誤",
              onClick: () => scrollToAnchor("result_view", 200),
            },
          });
        }
      } catch (error) {
        console.error("handleTrainingComplete error:", error);
        toast.error("系統異常，請稍後重試。");
      } finally {
        setIsCompleted(false);
      }
    };

    handleTrainingComplete();
  }, [
    addResult,
    changeStatus,
    isCompleted,
    setIsCompleted,
    runningScheduleId,
    modelId,
    versionId,
  ]);

  // 按鈕啟用的條件邏輯（抽象）
  const isStartable = schedule?.status === "scheduled";
  const isReschedulable = schedule?.status === "failed";
  const isComparable = schedule?.status === "completed";

  // 啟動訓練
  const handleTrainingAction = (mode: "start" | "retrain") => {
    if (mode === "start") {
      setRetraining(false);
      setStarting(true);
    } else {
      setStarting(false);
      setRetraining(true);
    }

    changeStatus(scheduleId, "running");
    scrollToAnchor("progress_view", 200);
  };

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
      {model && versionId && schedule ? (
        <ScheduleHeader
          modelName={model.name}
          version={versionId}
          status={schedule.status}
          scheduledAt={schedule.runDate}
        />
      ) : (
        <EmptyState
          icon={<CalendarX className="w-10 h-10 text-muted-foreground" />}
          title="找不到模型版本資料"
          description="找不到對應的模型或版本，可能是資料已被移除或連結錯誤。"
          action={
            <Button variant="outline" onClick={() => router.push("/models")}>
              返回模型列表
            </Button>
          }
        />
      )}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          icon={<PlayCircle className="w-5 h-5" />}
          label={starting ? "啟動中..." : "開始訓練"}
          onClick={() => handleTrainingAction("start")}
          variant={schedule?.status === "scheduled" ? "warning" : "default"}
          disabled={!isStartable || starting}
        />
        <ActionCard
          icon={<RefreshCcw className="w-5 h-5" />}
          label={retraining ? "重新訓練中..." : "重新訓練"}
          onClick={() => handleTrainingAction("retrain")}
          variant={schedule?.status === "failed" ? "error" : "default"}
          disabled={!isReschedulable || retraining}
        />
        <ActionCard
          icon={<GitCompare className="w-5 h-5" />}
          label="前往比較頁"
          onClick={() => router.push(`/models/${modelId}/compare`)}
          variant={schedule?.status === "completed" ? "success" : "default"}
          disabled={!isComparable}
        />
        <ActionCard
          icon={<Settings2 className="w-5 h-5" />}
          label="返回版本頁"
          onClick={() => router.push(`/models/${modelId}/version/${versionId}`)}
        />
      </div>

      {/* 🧭 區塊五：訓練進度 or 訓練結果展示 */}
      {running && !isCompleted ? (
        <div id="progress_view" className="pt-8 space-y-6">
          <TrainingProgressCard progress={progress} initialized={isInitializing} connected={connected} />
        </div>
      ) : trainingResults && trainingResults.length > 0 ? (
        <div id="result_view" className="space-y-4">
          {trainingResults
            .sort(
              (a, b) =>
                new Date(b.completedAt).getTime() -
                new Date(a.completedAt).getTime()
            )
            .map((result) => (
              <TrainingResultItem key={result.completedAt} result={result} />
            ))}
        </div>
      ) : (
        <EmptyState
          icon={<PlayCircle className="w-10 h-10 text-muted-foreground" />}
          title="尚無訓練結果"
          description="此排程尚未執行，點擊「開始訓練」按鈕即可執行任務，並在完成後查看結果。"
        />
      )}
    </PageLoader>
  );
}
