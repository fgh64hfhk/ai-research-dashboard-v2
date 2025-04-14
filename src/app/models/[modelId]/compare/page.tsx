// app/models/[modelId]/compare/page.tsx

"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useModelContext } from "@/contexts/model/ModelContext";
import { useVersionContext } from "@/contexts/version/VersionContext";
import { useParameterContext } from "@/contexts/parameter/ParameterContext";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";

import { getParameterKey } from "@/lib/utils/parameter.helper";

import { Separator } from "@/components/ui/separator";
import { VersionSummaryCard } from "@/components/compare/VersionSummaryCard";
import { ParameterComparisonTable } from "@/components/compare/ParameterComparisonTable";
import { ResultComparisonCard } from "@/components/compare/ResultComparisonCard";

export default function VersionComparePage() {
  const { modelId } = useParams<{ modelId: string }>();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "v1.0";
  const to = searchParams.get("to") ?? "v1.1";

  const { models } = useModelContext().state;
  const { versionMap } = useVersionContext().state;
  const { parameterMap } = useParameterContext().state;
  const { resultMap } = useScheduleContext().state;

  const model = models.find((m) => m.modelId === modelId);
  const versions = versionMap[modelId] || [];
  const versionA = versions.find((v) => v.version === from);
  const versionB = versions.find((v) => v.version === to);

  if (!model || !versionA || !versionB) {
    return <div className="text-center text-muted-foreground py-12">無法找到對應版本，請重新選擇。</div>;
  }

  const paramKeyA = getParameterKey(modelId, versionA.version);
  const paramKeyB = getParameterKey(modelId, versionB.version);

  const paramsA = parameterMap[paramKeyA];
  const paramsB = parameterMap[paramKeyB];

  const resultA = Object.values(resultMap).find((r) => r.version === versionA.version && r.modelId === modelId);
  const resultB = Object.values(resultMap).find((r) => r.version === versionB.version && r.modelId === modelId);

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">模型版本比較</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VersionSummaryCard version={versionA} title={`版本 ${versionA.version}`} />
        <VersionSummaryCard version={versionB} title={`版本 ${versionB.version}`} />
      </div>

      <Separator />

      <ParameterComparisonTable from={paramsA} to={paramsB} />

      <Separator />

      <ResultComparisonCard resultA={resultA} resultB={resultB} />
    </div>
  );
}
