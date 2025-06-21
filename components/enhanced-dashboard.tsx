"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  DollarSign,
  Target,
  Zap,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { DataVisualization } from "./data-visualization"
import { ActionableAI } from "./actionable-ai"
import { web3Simulator, type VaultData, type MEVProtectionData, type UserPosition } from "@/lib/web3-integration"

interface SystemStatus {
  oracleBot: "active" | "inactive" | "warning"
  mevProtector: "active" | "inactive" | "warning"
  liquidationGuard: "active" | "inactive" | "warning"
  yieldSwitcher: "active" | "inactive" | "warning"
}

interface DashboardStats {
  totalValueProtected: number
  totalYieldGenerated: number
  mevAttemptsBlocked: number
  activeLiquidationAlerts: number
  averageLTV: number
  portfolioHealth: number
}

export function EnhancedDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    oracleBot: "active",
    mevProtector: "active",
    liquidationGuard: "active",
    yieldSwitcher: "active",
  })

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalValueProtected: 0,
    totalYieldGenerated: 0,
    mevAttemptsBlocked: 0,
    activeLiquidationAlerts: 0,
    averageLTV: 0,
    portfolioHealth: 0,
  })

  const [vaultData, setVaultData] = useState<VaultData | null>(null)
  const [mevData, setMevData] = useState<MEVProtectionData | null>(null)
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()

    // Update data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Simulate loading multiple data sources
      const [vault, mev, position] = await Promise.all([
        web3Simulator.getVaultInfo("0x1234567890123456789012345678901234567890"),
        web3Simulator.getMEVProtectionData(),
        web3Simulator.getUserPosition("user-123"),
      ])

      // Create dummy vault if none exists
      if (!vault) {
        const newVault = await web3Simulator.createVault(10, 6.5, 80)
        setVaultData(newVault)
      } else {
        setVaultData(vault)
      }

      setMevData(mev)

      // Create dummy position if none exists
      if (!position) {
        const newPosition = await web3Simulator.createPosition("user-123", 50000, 0, true)
        setUserPosition(newPosition)
      } else {
        setUserPosition(position)
      }

      // Calculate dashboard stats
      const stats: DashboardStats = {
        totalValueProtected: 2847392,
        totalYieldGenerated: position?.totalYieldEarned || 156789,
        mevAttemptsBlocked: mev.totalMEVBlocked,
        activeLiquidationAlerts: vault?.currentLTV > 75 ? 1 : 0,
        averageLTV: vault?.currentLTV || 65,
        portfolioHealth: calculatePortfolioHealth(vault, position),
      }

      setDashboardStats(stats)
      setLastUpdated(new Date())

      // Simulate occasional system warnings
      if (Math.random() < 0.1) {
        setSystemStatus((prev) => ({
          ...prev,
          oracleBot: Math.random() < 0.5 ? "warning" : "active",
        }))
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePortfolioHealth = (vault: VaultData | null, position: UserPosition | null): number => {
    if (!vault && !position) return 0

    let healthScore = 100

    // Deduct points for high LTV
    if (vault && vault.currentLTV > 80) healthScore -= 30
    else if (vault && vault.currentLTV > 70) healthScore -= 15
    else if (vault && vault.currentLTV > 60) healthScore -= 5

    // Add points for yield generation
    if (position && position.currentAPR > 5) healthScore += 10
    else if (position && position.currentAPR > 3) healthScore += 5

    // Deduct points for high risk strategies
    if (position && position.strategyId === 4) healthScore -= 10 // Convex stETH is high risk

    return Math.max(0, Math.min(100, healthScore))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "inactive":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "inactive":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const refreshData = () => {
    loadDashboardData()
  }

  if (isLoading && !vaultData && !mevData && !userPosition) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>VaultGuard System Status</span>
              </CardTitle>
              <CardDescription>Last updated: {lastUpdated.toLocaleTimeString()}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className={getStatusColor(systemStatus.oracleBot)}>{getStatusIcon(systemStatus.oracleBot)}</div>
              <div>
                <div className="text-sm font-medium">Oracle Bot</div>
                <div className={`text-xs ${getStatusColor(systemStatus.oracleBot)}`}>
                  {systemStatus.oracleBot.charAt(0).toUpperCase() + systemStatus.oracleBot.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={getStatusColor(systemStatus.mevProtector)}>
                {getStatusIcon(systemStatus.mevProtector)}
              </div>
              <div>
                <div className="text-sm font-medium">MEV Protector</div>
                <div className={`text-xs ${getStatusColor(systemStatus.mevProtector)}`}>
                  {systemStatus.mevProtector.charAt(0).toUpperCase() + systemStatus.mevProtector.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={getStatusColor(systemStatus.liquidationGuard)}>
                {getStatusIcon(systemStatus.liquidationGuard)}
              </div>
              <div>
                <div className="text-sm font-medium">Liquidation Guard</div>
                <div className={`text-xs ${getStatusColor(systemStatus.liquidationGuard)}`}>
                  {systemStatus.liquidationGuard.charAt(0).toUpperCase() + systemStatus.liquidationGuard.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={getStatusColor(systemStatus.yieldSwitcher)}>
                {getStatusIcon(systemStatus.yieldSwitcher)}
              </div>
              <div>
                <div className="text-sm font-medium">Yield Switcher</div>
                <div className={`text-xs ${getStatusColor(systemStatus.yieldSwitcher)}`}>
                  {systemStatus.yieldSwitcher.charAt(0).toUpperCase() + systemStatus.yieldSwitcher.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Portfolio Health Score</span>
          </CardTitle>
          <CardDescription>Overall assessment of your DeFi positions and risk exposure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{dashboardStats.portfolioHealth}/100</span>
              <Badge
                variant={
                  dashboardStats.portfolioHealth >= 80
                    ? "default"
                    : dashboardStats.portfolioHealth >= 60
                      ? "secondary"
                      : "destructive"
                }
              >
                {dashboardStats.portfolioHealth >= 80
                  ? "Excellent"
                  : dashboardStats.portfolioHealth >= 60
                    ? "Good"
                    : "Needs Attention"}
              </Badge>
            </div>
            <Progress value={dashboardStats.portfolioHealth} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Average LTV</div>
                <div className="font-medium">{dashboardStats.averageLTV.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Active Alerts</div>
                <div className="font-medium">{dashboardStats.activeLiquidationAlerts}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Yield APR</div>
                <div className="font-medium">{userPosition?.currentAPR.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value Protected</p>
                    <p className="text-2xl font-bold">${dashboardStats.totalValueProtected.toLocaleString()}</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Yield Generated</p>
                    <p className="text-2xl font-bold">${dashboardStats.totalYieldGenerated.toLocaleString()}</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3% from last month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">MEV Attacks Blocked</p>
                    <p className="text-2xl font-bold">{dashboardStats.mevAttemptsBlocked.toLocaleString()}</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +23.1% from last month
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold">{dashboardStats.activeLiquidationAlerts}</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      -2 from yesterday
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and emergency controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Add Collateral</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Switch Yield</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Activity className="h-6 w-6" />
                  <span className="text-sm">Enable MEV Protection</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">Emergency Stop</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DataVisualization />
        </TabsContent>

        <TabsContent value="ai-recommendations" className="space-y-4">
          <ActionableAI onActionExecuted={(rec) => console.log("Action executed:", rec)} />
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vault Information */}
            {vaultData && (
              <Card>
                <CardHeader>
                  <CardTitle>Liquidation Protection Vault</CardTitle>
                  <CardDescription>Your collateralized position details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Collateral</div>
                        <div className="text-lg font-semibold">{vaultData.collateralAmount} ETH</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Debt</div>
                        <div className="text-lg font-semibold">${vaultData.debtAmount.toLocaleString()}</div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Current LTV</span>
                        <span className="text-sm font-medium">{vaultData.currentLTV.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={vaultData.currentLTV}
                        className="h-2"
                        // @ts-ignore
                        indicatorClassName={
                          vaultData.currentLTV > 75
                            ? "bg-red-500"
                            : vaultData.currentLTV > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Safe</span>
                        <span>Liquidation: {vaultData.liquidationThreshold}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Yield Position */}
            {userPosition && (
              <Card>
                <CardHeader>
                  <CardTitle>Yield Optimization Position</CardTitle>
                  <CardDescription>Your current yield farming strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Strategy</div>
                        <div className="text-lg font-semibold">{userPosition.strategyName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="text-lg font-semibold">${userPosition.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Current APR</div>
                        <div className="text-lg font-semibold text-green-600">
                          {userPosition.currentAPR.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Earned</div>
                        <div className="text-lg font-semibold">${userPosition.totalYieldEarned.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Auto-Rebalance</span>
                      <Badge variant={userPosition.autoRebalanceEnabled ? "default" : "secondary"}>
                        {userPosition.autoRebalanceEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* MEV Protection Stats */}
          {mevData && (
            <Card>
              <CardHeader>
                <CardTitle>MEV Protection Statistics</CardTitle>
                <CardDescription>Recent protection activity and blocked attacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${mevData.totalMEVBlocked.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total MEV Blocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mevData.totalTransactionsProtected.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Transactions Protected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mevData.recentAttempts.length}</div>
                    <div className="text-sm text-muted-foreground">Recent Attempts</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recent MEV Attempts Blocked</h4>
                  {mevData.recentAttempts.slice(0, 3).map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">
                          {attempt.attackType.charAt(0).toUpperCase() + attempt.attackType.slice(1)} Attack
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          +${attempt.attemptedProfit.toLocaleString()} saved
                        </div>
                        <Badge variant="outline" size="sm">
                          Blocked
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
