export function oracleActionEngine(price: number, threshold: number, action: string) {
  if (price < threshold) {
    return `Trigger action: ${action} because price = ${price}`
  }
  return `No action needed. Price = ${price}`
}
