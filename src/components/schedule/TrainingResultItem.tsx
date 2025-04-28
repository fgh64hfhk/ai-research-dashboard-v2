"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainingResult } from "@/types/training";
import { format } from "date-fns";
import {
  BarChart3,
  CheckCircle2,
  FileQuestion,
  LogOut,
  XCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { scrollToAnchor } from "@/lib/utils/common.helper";

interface Props {
  result: TrainingResult;
}

export function TrainingResultItem({ result }: Props) {
  const isSuccess = result.status === "completed";
  const hasMetrics = result.metrics && Object.keys(result.metrics).length > 0;
  const hasLogs = result.logs && result.logs.length > 0;

  return (
    <Card className="shadow-md border-muted bg-muted/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="text-green-600 w-5 h-5" />
          ) : (
            <XCircle className="text-red-500 w-5 h-5" />
          )}
          訓練結果：{isSuccess ? "成功" : "失敗"}
        </CardTitle>
        <Badge variant={isSuccess ? "secondary" : "destructive"}>
          {result.status}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <p className="text-muted-foreground">
          完成時間：{format(new Date(result.completedAt), "yyyy-MM-dd HH:mm")}
        </p>
        <p className="text-muted-foreground">
          訓練時間：{result.trainingTime} 秒
        </p>

        {/* 訓練指標區塊 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              訓練指標
            </span>
          </div>
          {isSuccess && hasMetrics ? (
            <ul className="ml-6 list-disc text-muted-foreground">
              {Object.entries(result.metrics!).map(([key, val]) => (
                <li key={key}>
                  {key}:{" "}
                  <span className="font-medium text-foreground">{val}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ml-6 text-xs text-muted-foreground">無訓練指標資料</p>
          )}
        </div>

        {/* 訓練日誌區塊（可折疊） */}
        <div>
          <Accordion type="single" collapsible>
            <AccordionItem value="logs">
              <AccordionTrigger
                className="text-sm text-muted-foreground"
                onClick={() => {
                  scrollToAnchor("log_view", 200);
                }}
              >
                <div className={`flex gap-2 ${!isSuccess && "text-red-500"}`}>
                  <LogOut className="w-4 h-4" /> <span>查看訓練日誌</span>
                </div>
              </AccordionTrigger>
              <AccordionContent id="log_view">
                {hasLogs ? (
                  <ul className="ml-6 list-disc text-xs text-muted-foreground">
                    {result.logs!.map((log, idx) => (
                      <li key={idx}>{log}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground ml-6">
                    尚無訓練日誌紀錄
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {result.message && !isSuccess && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileQuestion className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                錯誤訊息
              </span>
            </div>
            <p className="text-sm text-destructive font-medium">
              {result.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
