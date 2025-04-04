// utils/wait.ts
export function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
