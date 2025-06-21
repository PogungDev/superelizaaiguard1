export interface UserSettings {
  userId: string
  oracleBotEnabled: boolean
  mevProtectorEnabled: boolean
  liquidationGuardEnabled: boolean
  yieldSwitcherEnabled: boolean
  liquidationThreshold: number
  maxRiskScore: number
  autoRebalanceEnabled: boolean
  notificationsEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  module: "oracle" | "mev" | "liquidation" | "yield"
  details: Record<string, any>
  result: "success" | "failure" | "pending"
  timestamp: Date
}

// Simulated Supabase client for demo purposes
class SupabaseSimulator {
  private userSettings: Map<string, UserSettings> = new Map()
  private auditLogs: AuditLog[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with default user settings
    const defaultSettings: UserSettings = {
      userId: "user-123",
      oracleBotEnabled: true,
      mevProtectorEnabled: true,
      liquidationGuardEnabled: true,
      yieldSwitcherEnabled: true,
      liquidationThreshold: 80,
      maxRiskScore: 7,
      autoRebalanceEnabled: true,
      notificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.userSettings.set("user-123", defaultSettings)

    // Initialize with some audit logs
    this.auditLogs = [
      {
        id: "1",
        userId: "user-123",
        action: "Auto-rebalance executed",
        module: "liquidation",
        details: { oldLTV: 78, newLTV: 65, collateralAdded: 2.5 },
        result: "success",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        userId: "user-123",
        action: "MEV attack blocked",
        module: "mev",
        details: { attackType: "frontrun", savedAmount: 890 },
        result: "success",
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: "3",
        userId: "user-123",
        action: "Yield strategy switched",
        module: "yield",
        details: { fromStrategy: "Aave USDC", toStrategy: "Convex stETH", aprIncrease: 2.3 },
        result: "success",
        timestamp: new Date(Date.now() - 10800000),
      },
    ]
  }

  // User Settings CRUD operations
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    return this.userSettings.get(userId) || null
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
    const existing = this.userSettings.get(userId)
    if (!existing) {
      throw new Error("User settings not found")
    }

    const updated: UserSettings = {
      ...existing,
      ...settings,
      updatedAt: new Date(),
    }

    this.userSettings.set(userId, updated)
    return updated
  }

  async createUserSettings(settings: Omit<UserSettings, "createdAt" | "updatedAt">): Promise<UserSettings> {
    const newSettings: UserSettings = {
      ...settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.userSettings.set(settings.userId, newSettings)
    return newSettings
  }

  // Audit Logs operations
  async getAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    this.auditLogs.unshift(newLog)

    // Keep only last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(0, 1000)
    }

    return newLog
  }

  async getAuditLogsByModule(userId: string, module: AuditLog["module"]): Promise<AuditLog[]> {
    return this.auditLogs
      .filter((log) => log.userId === userId && log.module === module)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Analytics queries
  async getModuleStats(userId: string): Promise<Record<string, number>> {
    const logs = await this.getAuditLogs(userId)
    const stats: Record<string, number> = {}

    logs.forEach((log) => {
      stats[log.module] = (stats[log.module] || 0) + 1
    })

    return stats
  }

  async getSuccessRate(userId: string, module?: AuditLog["module"]): Promise<number> {
    let logs = await this.getAuditLogs(userId)

    if (module) {
      logs = logs.filter((log) => log.module === module)
    }

    if (logs.length === 0) return 0

    const successCount = logs.filter((log) => log.result === "success").length
    return (successCount / logs.length) * 100
  }
}

export const supabaseSimulator = new SupabaseSimulator()
