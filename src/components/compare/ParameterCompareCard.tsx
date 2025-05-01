import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ParameterItem {
  key: string;
  baseValue?: string | number | boolean;
  targetValue?: string | number | boolean;
}

interface ParameterCompareCardProps {
  baseVersionId: string;
  targetVersionId?: string;
  parameters: ParameterItem[];
  isSingleView?: boolean; // 單一版本視窗
}

export default function ParameterCompareCard({
  baseVersionId,
  targetVersionId,
  parameters,
  isSingleView = false,
}: ParameterCompareCardProps) {
  const getDiff = (
    a: string | number | boolean | undefined,
    b: string | number | boolean | undefined
  ) => {
    return a !== b ? true : false;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">參數設定</h3>
        <p className="text-sm text-muted-foreground">
          {isSingleView
            ? `版本：${baseVersionId}`
            : `版本比較：${targetVersionId} ↔ ${baseVersionId}`}
        </p>
      </div>

      <CardContent className="space-y-2 px-2">
        {parameters.length > 0 ? (
          isSingleView ? (
            // ===== 單一版本列表模式 =====
            <div className="space-y-2">
              {parameters.map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center text-sm border-b py-2"
                >
                  <div className="font-medium">{item.key}</div>
                  <div className="text-right text-muted-foreground">
                    {String(item.baseValue) ?? "-"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // ===== 比較模式：表格版 =====
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">參數名稱</th>
                    <th className="text-center p-2 font-semibold">
                      {targetVersionId}
                    </th>
                    <th className="text-center p-2 font-semibold">→</th>
                    <th className="text-center p-2 font-semibold">
                      {baseVersionId}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((item) => {
                    const isDiff = getDiff(item.baseValue, item.targetValue);
                    return (
                      <tr key={item.key} className="border-b">
                        <td className="p-2">{item.key}</td>
                        <td
                          className={cn(
                            "text-center p-2",
                            isDiff
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {String(item.targetValue) ?? "-"}
                        </td>
                        <td className="text-center p-2">→</td>
                        <td
                          className={cn(
                            "text-center p-2",
                            isDiff
                              ? "font-medium text-blue-500"
                              : "text-muted-foreground"
                          )}
                        >
                          {String(item.baseValue) ?? "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-sm text-muted-foreground py-8 text-center">
            尚無參數資料
          </div>
        )}
      </CardContent>
    </Card>
  );
}
