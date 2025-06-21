export function liquidationWatchdog(ltv: number, maxLTV: number) {
  if (ltv > maxLTV) {
    return `🚨 Liquidation Risk! LTV = ${ltv}% (limit: ${maxLTV}%)`
  }
  return `🟢 Safe Position: LTV = ${ltv}%`
}
