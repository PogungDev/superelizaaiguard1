export function yieldSwitchAI(currentAPR: number, bestAPR: number, pool: string) {
  if (bestAPR > currentAPR + 1.5) {
    return `🔁 Switch to ${pool} with APR ${bestAPR}% (current: ${currentAPR}%)`
  }
  return `👍 Current vault still optimal. APR = ${currentAPR}%`
}
