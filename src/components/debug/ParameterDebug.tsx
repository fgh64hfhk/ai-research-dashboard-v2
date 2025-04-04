"use client";

import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { getParameterKey } from "@/hooks/parameter/parameter.hooks";

interface Props {
  modelId: string;
  version: string;
}

export function ParameterDebug({ modelId, version }: Props) {
  const parameters = useParameterByVersionKey(modelId, version);
  const key = getParameterKey(modelId, version);

  if (!parameters) {
    return (
      <div className="text-sm text-muted-foreground">找不到參數：{key}</div>
    );
  }

  return (
    <>
      <h3 className="font-semibold mb-2">參數 JSON（{key}）</h3>
      <pre>{JSON.stringify(parameters, null, 2)}</pre>
    </>
  );
}
