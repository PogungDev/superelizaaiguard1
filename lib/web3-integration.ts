export interface ChainlinkPriceFeed {
  address: string
  decimals: number
  description: string
  latestPrice: number
  lastUpdated: number
}

export interface VaultData {
  owner: string
  collateralAmount: number
  debtAmount: number
  liquidationThreshold: number
  currentLTV: number
  isActive: boolean
  lastUpdateTime: number
}

export interface MEVProtectionData {
  totalMEVBlocked: number
  totalTransactionsProtected: number
  recentAttempts: MEVAttempt[]
}

export interface MEVAttempt {
  originalTxHash: string
  attacker: string
  attemptedProfit: number
  timestamp: number
  wasBlocked: boolean
  attackType: "frontrun" | "sandwich" | "backrun"
}

export interface YieldStrategy {
  id: number
  name: string
  protocol: string
  currentAPR: number
  tvl: number
  riskScore: number
  isActive: boolean
  lastUpdated: number
}

export interface UserPosition {
  amount: number
  strategyId: number
  strategyName: string
  currentAPR: number
  totalYieldEarned: number
  pendingYield: number
  autoRebalanceEnabled: boolean
  entryTime: number
  lastRebalance: number
}

// Simulated Web3 functions for demo purposes
export class Web3Simulator {
  private static instance: Web3Simulator
  private vaults: Map<string, VaultData> = new Map()
  private mevData: MEVProtectionData
  private strategies: YieldStrategy[]
  private userPositions: Map<string, UserPosition> = new Map()

  constructor() {
    this.initializeData()
  }

  static getInstance(): Web3Simulator {
    if (!Web3Simulator.instance) {
      Web3Simulator.instance = new Web3Simulator()
    }
    return Web3Simulator.instance
  }

  private initializeData() {
    // Initialize MEV data
    this.mevData = {
      totalMEVBlocked: 2847392,
      totalTransactionsProtected: 15847,
      recentAttempts: [
        {
          originalTxHash: "0x1234...abcd",
          attacker: "0x5678...efgh",
          attemptedProfit: 1250,
          timestamp: Date.now() - 3600000,
          wasBlocked: true,
          attackType: "frontrun",
        },
        {
          originalTxHash: "0x2345...bcde",
          attacker: "0x6789...fghi",
          attemptedProfit: 890,
          timestamp: Date.now() - 7200000,
          wasBlocked: true,
          attackType: "sandwich",
        },
      ],
    }

    // Initialize yield strategies
    this.strategies = [
      {
        id: 0,
        name: "Aave USDC",
        protocol: "Aave",
        currentAPR: 4.5,
        tvl: 1000000,
        riskScore: 3,
        isActive: true,
        lastUpdated: Date.now(),
      },
      {
        id: 1,
        name: "Compound DAI",
        protocol: "Compound",
        currentAPR: 3.8,
        tvl: 800000,
        riskScore: 2,
        isActive: true,
        lastUpdated: Date.now(),
      },
      {
        id: 2,
        name: "Yearn USDT",
        protocol: "Yearn",
        currentAPR: 5.2,
        tvl: 600000,
        riskScore: 5,
        isActive: true,
        lastUpdated: Date.now(),
      },
      {
        id: 3,
        name: "Curve 3Pool",
        protocol: "Curve",
        currentAPR: 2.9,
        tvl: 2000000,
        riskScore: 1,
        isActive: true,
        lastUpdated: Date.now(),
      },
      {
        id: 4,
        name: "Convex stETH",
        protocol: "Convex",
        currentAPR: 6.8,
        tvl: 500000,
        riskScore: 7,
        isActive: true,
        lastUpdated: Date.now(),
      },
    ]
  }

  // Chainlink Price Feed simulation
  async getLatestPrice(asset: string): Promise<ChainlinkPriceFeed> {
    const prices: Record<string, number> = {
      "ETH/USD": 2847.32,
      "BTC/USD": 67234.18,
      "USDC/USD": 1.0001,
      "DAI/USD": 0.9998,
      "USDT/USD": 1.0002,
    }

    return {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      decimals: 8,
      description: `${asset} Price Feed`,
      latestPrice: prices[asset] || 1,
      lastUpdated: Date.now(),
    }
  }

  // Vault management
  async createVault(collateralAmount: number, debtAmount: number, liquidationThreshold: number): Promise<VaultData> {
    const owner = `0x${Math.random().toString(16).substr(2, 40)}`
    const vault: VaultData = {
      owner,
      collateralAmount,
      debtAmount,
      liquidationThreshold,
      currentLTV: (debtAmount / collateralAmount) * 100,
      isActive: true,
      lastUpdateTime: Date.now(),
    }

    this.vaults.set(owner, vault)
    return vault
  }

  async getVaultInfo(owner: string): Promise<VaultData | null> {
    return this.vaults.get(owner) || null
  }

  async checkLiquidationRisk(owner: string): Promise<{ atRisk: boolean; currentLTV: number }> {
    const vault = this.vaults.get(owner)
    if (!vault) return { atRisk: false, currentLTV: 0 }

    const ethPrice = await this.getLatestPrice("ETH/USD")
    const collateralValue = vault.collateralAmount * ethPrice.latestPrice
    const currentLTV = (vault.debtAmount / collateralValue) * 100

    vault.currentLTV = currentLTV
    const atRisk = currentLTV >= vault.liquidationThreshold - 5 // 5% buffer

    return { atRisk, currentLTV }
  }

  // MEV Protection
  async getMEVProtectionData(): Promise<MEVProtectionData> {
    return this.mevData
  }

  async reportMEVAttempt(attempt: Omit<MEVAttempt, "timestamp" | "wasBlocked">): Promise<void> {
    const newAttempt: MEVAttempt = {
      ...attempt,
      timestamp: Date.now(),
      wasBlocked: true,
    }

    this.mevData.recentAttempts.unshift(newAttempt)
    this.mevData.totalMEVBlocked += attempt.attemptedProfit
    this.mevData.totalTransactionsProtected += 1

    // Keep only last 10 attempts
    if (this.mevData.recentAttempts.length > 10) {
      this.mevData.recentAttempts = this.mevData.recentAttempts.slice(0, 10)
    }
  }

  // Yield Optimization
  async getAllStrategies(): Promise<YieldStrategy[]> {
    return this.strategies
  }

  async findOptimalStrategy(amount: number, maxRiskScore: number): Promise<YieldStrategy | null> {
    const eligibleStrategies = this.strategies.filter((s) => s.isActive && s.riskScore <= maxRiskScore)

    if (eligibleStrategies.length === 0) return null

    return eligibleStrategies.reduce((best, current) => (current.currentAPR > best.currentAPR ? current : best))
  }

  async createPosition(
    userId: string,
    amount: number,
    strategyId: number,
    autoRebalance: boolean,
  ): Promise<UserPosition> {
    const strategy = this.strategies.find((s) => s.id === strategyId)
    if (!strategy) throw new Error("Strategy not found")

    const position: UserPosition = {
      amount,
      strategyId,
      strategyName: strategy.name,
      currentAPR: strategy.currentAPR,
      totalYieldEarned: 0,
      pendingYield: 0,
      autoRebalanceEnabled: autoRebalance,
      entryTime: Date.now(),
      lastRebalance: Date.now(),
    }

    this.userPositions.set(userId, position)
    return position
  }

  async getUserPosition(userId: string): Promise<UserPosition | null> {
    const position = this.userPositions.get(userId)
    if (!position) return null

    // Calculate pending yield
    const timeElapsed = Date.now() - position.lastRebalance
    const yearlyYield = (position.amount * position.currentAPR) / 100
    const pendingYield = (yearlyYield * timeElapsed) / (365 * 24 * 60 * 60 * 1000)

    return {
      ...position,
      pendingYield,
    }
  }

  async checkRebalanceOpportunity(userId: string): Promise<{
    shouldRebalance: boolean
    currentStrategy: number
    recommendedStrategy: number
    aprDifference: number
  }> {
    const position = this.userPositions.get(userId)
    if (!position || !position.autoRebalanceEnabled) {
      return { shouldRebalance: false, currentStrategy: 0, recommendedStrategy: 0, aprDifference: 0 }
    }

    const currentStrategy = this.strategies.find((s) => s.id === position.strategyId)
    if (!currentStrategy) {
      return { shouldRebalance: false, currentStrategy: 0, recommendedStrategy: 0, aprDifference: 0 }
    }

    const optimalStrategy = await this.findOptimalStrategy(position.amount, currentStrategy.riskScore)
    if (!optimalStrategy || optimalStrategy.id === position.strategyId) {
      return {
        shouldRebalance: false,
        currentStrategy: position.strategyId,
        recommendedStrategy: position.strategyId,
        aprDifference: 0,
      }
    }

    const aprDifference = optimalStrategy.currentAPR - currentStrategy.currentAPR
    const shouldRebalance = aprDifference >= 1.0 // 1% threshold

    return {
      shouldRebalance,
      currentStrategy: position.strategyId,
      recommendedStrategy: optimalStrategy.id,
      aprDifference,
    }
  }

  async executeRebalance(userId: string, newStrategyId: number): Promise<void> {
    const position = this.userPositions.get(userId)
    const newStrategy = this.strategies.find((s) => s.id === newStrategyId)

    if (!position || !newStrategy) throw new Error("Position or strategy not found")

    // Calculate and add pending yield to total
    const timeElapsed = Date.now() - position.lastRebalance
    const yearlyYield = (position.amount * position.currentAPR) / 100
    const pendingYield = (yearlyYield * timeElapsed) / (365 * 24 * 60 * 60 * 1000)

    position.totalYieldEarned += pendingYield
    position.strategyId = newStrategyId
    position.strategyName = newStrategy.name
    position.currentAPR = newStrategy.currentAPR
    position.lastRebalance = Date.now()
    position.pendingYield = 0

    this.userPositions.set(userId, position)
  }

  // Update strategy APRs (simulate market changes)
  updateStrategyAPRs(): void {
    this.strategies.forEach((strategy) => {
      // Random APR fluctuation ±0.5%
      const change = (Math.random() - 0.5) * 1.0
      strategy.currentAPR = Math.max(0.1, strategy.currentAPR + change)
      strategy.lastUpdated = Date.now()
    })
  }
}

export const web3Simulator = Web3Simulator.getInstance()
