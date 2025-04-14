// lib/api/parameter.ts
import { mockModelParameters } from "@/mock/modelVersionsData";
import { ModelParameters } from "@/types/parameters";

export async function fetchMockParameters(): Promise<
  Record<string, ModelParameters>
> {
  return mockModelParameters;
}
