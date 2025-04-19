"use client";

import { TrainingSchedule, ScheduleType } from "@/types/schedule";
import { CalendarClock, UserCog, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleStatusBadge } from "@/components/schedule/ScheduleStatusBadge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  schedule: TrainingSchedule;
  className?: string;
}

const typeIcons: Record<ScheduleType, React.ReactNode> = {
  manual: <UserCog className="w-4 h-4 text-muted-foreground" />,
  auto: <Settings className="w-4 h-4 text-muted-foreground" />,
  recurring: <CalendarClock className="w-4 h-4 text-muted-foreground" />,
};

export function NextTrainingScheduleCard({ schedule, className }: Props) {
  const router = useRouter();
  return (
    <Card
      id="schedule_view"
      className={cn(
        "border-l-4 border-yellow-400 cursor-pointer hover:shadow-md transition",
        className
      )}
      onClick={() => router.push(`/schedule/${schedule.scheduleId}`)}
    >
      <CardContent className="py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {typeIcons[schedule.type]}
            <span>
              {schedule.type === "manual"
                ? "手動排程"
                : schedule.type === "auto"
                ? "系統排程"
                : "定期排程"}
            </span>
          </div>
          <ScheduleStatusBadge status={schedule.status} />
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">預定訓練時間：</span>
          <span className="font-medium">
            {format(new Date(schedule.runDate), "yyyy-MM-dd HH:mm")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
