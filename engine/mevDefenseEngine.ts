export function mevDefenseEngine(gas: number, mempoolAlert: boolean) {
  if (gas > 100 && mempoolAlert) {
    return "⚠️ High MEV Risk Detected – Delay or Reroute TX"
  }
  return "✅ Safe to Proceed – Low MEV Activity"
}
