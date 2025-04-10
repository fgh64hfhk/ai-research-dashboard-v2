// components/compare/ParameterComparisonTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModelParameters } from "@/types/parameters";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface Props {
  from?: ModelParameters;
  to?: ModelParameters;
}

export function ParameterComparisonTable({ from, to }: Props) {
  if (!from || !to) {
    return (
      <EmptyState
        icon={<SlidersHorizontal className="w-10 h-10" />}
        title="無法顯示參數對比"
        description="請確認兩個版本都有設定模型參數。"
      />
    );
  }

  const rows = [
    { key: "learningRate", label: "學習率" },
    { key: "batchSize", label: "批次大小" },
    { key: "epochs", label: "訓練週期數" },
    { key: "optimizer", label: "優化器" },
    { key: "lossFunction", label: "損失函數" },
    { key: "datasetVersion", label: "資料集版本" },
    { key: "pretrainedModel", label: "使用預訓練模型" },
    { key: "augmentation", label: "啟用資料增強" },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">參數對比</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>參數名稱</TableHead>
            <TableHead>版本 A</TableHead>
            <TableHead>版本 B</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ key, label }) => {
            const valueA = String(from[key as keyof ModelParameters]);
            const valueB = String(to[key as keyof ModelParameters]);
            const isDifferent = valueA !== valueB;
            return (
              <TableRow
                key={key}
                className={isDifferent ? "bg-yellow-50" : undefined}
              >
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell>{valueA}</TableCell>
                <TableCell>{valueB}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
