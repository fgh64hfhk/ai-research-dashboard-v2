// 模擬 API 回應時間間隔的工具函數
export function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
