"use client";

import {
  useVersionsByModelId,
  useVersionLoading,
} from "@/hooks/version/version.hooks";
import { ParameterDebug } from "@/components/debug/ParameterDebug";
import { ScheduleDebug } from "./ScheduleDebug";

interface Props {
  modelId: string;
}

export function ModelVersionDebug({ modelId }: Props) {
  const versions = useVersionsByModelId(modelId);
  const loading = useVersionLoading(modelId);

  if (loading) {
    return <p className="text-muted-foreground">載入中...</p>;
  }

  return (
    <>
      <div className="bg-muted text-sm p-4 rounded-lg overflow-auto max-h-[400px]">
        <h3 className="font-semibold mb-2">版本 JSON（{modelId}）</h3>
        <pre>{JSON.stringify(versions, null, 2)}</pre>
      </div>
      <br />
      <>
        {versions.map((v) => (
          <div key={v.version}>
            <div className="bg-muted text-sm p-4 rounded-lg overflow-auto max-h-[400px]">
              <ParameterDebug modelId={modelId} version={v.version} />
              <hr />
              <ScheduleDebug modelId={modelId} version={v.version} />
            </div>
            <br />
          </div>
        ))}
      </>
    </>
  );
}
