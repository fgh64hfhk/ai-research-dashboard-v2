// components/model/TrainingScheduleView.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  CalendarClock,
  Settings,
  UserCog,
  Repeat,
  RefreshCw,
} from "lucide-react";

import { format } from "date-fns";
import { ScheduleStatusBadge } from "@/components/schedule/ScheduleStatusBadge";

import {
  TrainingSchedule,
  ScheduleStatus,
  ScheduleType,
} from "@/types/schedule";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";

const statusConfig: Record<
  ScheduleStatus,
  { label: string; variant: string; icon: React.ReactNode; highlight?: boolean }
> = {
  scheduled: {
    label: "已排程",
    variant: "secondary",
    icon: <CalendarClock className="w-4 h-4" />,
  },
  running: {
    label: "執行中",
    variant: "info",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  completed: {
    label: "已完成",
    variant: "success",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  failed: {
    label: "執行失敗",
    variant: "destructive",
    icon: <AlertCircle className="w-4 h-4" />,
    highlight: true, // 用來提醒用戶這筆資料需要注意
  },
};

export const typeLabels: Record<
  ScheduleType,
  { label: string; icon: React.ReactNode }
> = {
  manual: { label: "手動排程", icon: <UserCog className="w-4 h-4" /> },
  auto: { label: "系統排程", icon: <Settings className="w-4 h-4" /> },
  recurring: { label: "定期排程", icon: <Repeat className="w-4 h-4" /> },
};

interface Props {
  schedules: TrainingSchedule[];
}

export function TrainingScheduleView({ schedules }: Props) {
  const router = useRouter();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  if (!schedules || schedules.length === 0) {
    return (
      <EmptyState
        icon={<CalendarClock className="w-10 h-10" />}
        title="尚無訓練排程"
        description="當你建立排程後，會在這裡看到排程清單"
        action={
          <Button onClick={() => router.push("/schedule/create")}>建立排程</Button>
        }
      />
    );
  }

  const retrySchedule = async (id: string) => {
    // mock retry function
    setRetryingId(id);
    // 在實際專案中可串接 API 或顯示 toast 成功通知
    toast.info("正在重新排程...");

    // 模擬 async 處理
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`已重新排程任務：${id}`);
    setRetryingId(null);
  };

  const sorted = [...schedules].sort(
    (a, b) => new Date(b.runDate).getTime() - new Date(a.runDate).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">訓練排程</h2>

      {sorted.map((s) => {
        const status = statusConfig[s.status];
        const type = typeLabels[s.type];

        return (
          <Card
            key={s.id}
            className={
              status.highlight ? "border-destructive/50 bg-destructive/5" : ""
            }
          >
            <CardContent className="py-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {status.icon}
                  <span className="font-medium text-sm">{status.label}</span>
                </div>
                <ScheduleStatusBadge status={s.status} />
              </div>

              <div className="text-sm text-muted-foreground">
                執行時間：{format(new Date(s.runDate), "yyyy-MM-dd HH:mm")}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {type.icon}
                {type.label}
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/schedule/${s.id}`)}
                >
                  檢視詳細
                </Button>
                {s.status === "failed" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={retryingId === s.id}
                    onClick={() => retrySchedule(s.id)}
                  >
                    {retryingId === s.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        處理中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        重新排程
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
