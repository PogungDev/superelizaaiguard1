export interface ChartDataPoint {
  timestamp: number
  value: number
  label?: string
}

export interface HistoricalData {
  ltv: ChartDataPoint[]
  yield: ChartDataPoint[]
  mevAttempts: ChartDataPoint[]
  priceFeeds: ChartDataPoint[]
}

export class ChartDataGenerator {
  static generateLTVHistory(days = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    let currentLTV = 65 // Start at 65% LTV

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * dayMs

      // Simulate LTV fluctuations
      const change = (Math.random() - 0.5) * 4 // ±2% change
      currentLTV = Math.max(30, Math.min(85, currentLTV + change))

      data.push({
        timestamp,
        value: currentLTV,
        label: `${currentLTV.toFixed(1)}%`,
      })
    }

    return data
  }

  static generateYieldHistory(days = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    let cumulativeYield = 0
    const dailyYieldRate = 0.015 // ~5.5% APR

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * dayMs

      // Add daily yield with some randomness
      const dailyYield = dailyYieldRate * (0.8 + Math.random() * 0.4)
      cumulativeYield += dailyYield

      data.push({
        timestamp,
        value: cumulativeYield,
        label: `$${cumulativeYield.toFixed(2)}`,
      })
    }

    return data
  }

  static generateMEVAttemptsHistory(days = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * dayMs

      // Simulate MEV attempts (0-15 per day)
      const attempts = Math.floor(Math.random() * 16)

      data.push({
        timestamp,
        value: attempts,
        label: `${attempts} attempts`,
      })
    }

    return data
  }

  static generatePriceFeedHistory(asset: string, days = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    const basePrices: Record<string, number> = {
      ETH: 2800,
      BTC: 67000,
      USDC: 1.0,
      DAI: 1.0,
      USDT: 1.0,
    }

    let currentPrice = basePrices[asset] || 1

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * dayMs

      // Simulate price movements
      const volatility = asset === "ETH" || asset === "BTC" ? 0.05 : 0.001
      const change = (Math.random() - 0.5) * 2 * volatility
      currentPrice = Math.max(0.01, currentPrice * (1 + change))

      data.push({
        timestamp,
        value: currentPrice,
        label: `$${currentPrice.toFixed(asset === "ETH" || asset === "BTC" ? 0 : 4)}`,
      })
    }

    return data
  }

  static generateRealTimeData(): HistoricalData {
    return {
      ltv: this.generateLTVHistory(30),
      yield: this.generateYieldHistory(30),
      mevAttempts: this.generateMEVAttemptsHistory(30),
      priceFeeds: this.generatePriceFeedHistory("ETH", 30),
    }
  }

  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  static formatValue(value: number, type: "currency" | "percentage" | "number"): string {
    switch (type) {
      case "currency":
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "percentage":
        return `${value.toFixed(1)}%`
      case "number":
        return value.toLocaleString()
      default:
        return value.toString()
    }
  }
}
