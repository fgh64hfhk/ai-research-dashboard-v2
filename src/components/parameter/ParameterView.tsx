import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Info,
  Settings,
  SlidersHorizontal,
  Database,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ModelParameterItem {
  key: string;
  value: string | number | boolean | object | undefined;
  description?: string;
  group?: string;
}

interface Props {
  parameters: ModelParameterItem[];
}

const groupIcons: Record<string, React.ReactNode> = {
  訓練設定: <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />,
  優化器設定: <Settings className="w-4 h-4 text-muted-foreground" />,
  資料設定: <Database className="w-4 h-4 text-muted-foreground" />,
  模型初始化: <Layers className="w-4 h-4 text-muted-foreground" />,
  其他參數: <Info className="w-4 h-4 text-muted-foreground" />,
};

export default function ParameterView({ parameters }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!parameters) return;
    navigator.clipboard.writeText(JSON.stringify(parameters, null, 2));
    setCopied(true);
    toast.success("參數已複製到剪貼簿！");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!parameters || parameters.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-medium mb-1">參數設定</h2>
        <p className="text-sm text-muted-foreground">尚未設定任何參數。</p>
      </div>
    );
  }

  const grouped = parameters.reduce<Record<string, ModelParameterItem[]>>(
    (acc, item) => {
      const group = item.group || "其他參數";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {}
  );

  return (
    <Card id="param_view">
      <CardContent className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">參數設定</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs"
          >
            <Copy className="w-4 h-4" />
            {copied ? "已複製" : "複製 JSON"}
          </Button>
        </div>

        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              {groupIcons[group] ?? (
                <Info className="w-4 h-4 text-muted-foreground" />
              )}
              {group}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-md overflow-hidden">
                <thead className="bg-muted text-muted-foreground text-left">
                  <tr>
                    <th className="px-4 py-2 w-1/4">參數名稱</th>
                    <th className="px-4 py-2 w-1/3">參數值</th>
                    <th className="px-4 py-2">說明</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ key, value, description }) => (
                    <tr key={key} className="border-t">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {description ? (
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="whitespace-pre-wrap">
                                    {description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="hidden sm:inline">
                              {description}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
