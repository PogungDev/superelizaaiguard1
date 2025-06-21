"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, DollarSign, Activity, AlertTriangle, Eye, Zap, Link } from "lucide-react"
import { ChartDataGenerator, type ChartDataPoint, type HistoricalData } from "@/lib/chart-data"

interface DataVisualizationProps {
  visualUpdateTrigger?: {
    ltvChange?: number
    yieldChange?: number
    riskScoreChange?: number
    mevBlockedIncrease?: number
    timestamp: number
  } | null
}

interface SimpleLineChartProps {
  data: ChartDataPoint[]
  title: string
  color: string
  valueType: "currency" | "percentage" | "number"
  recentUpdate?: number
}

function SimpleLineChart({ data, title, color, valueType, recentUpdate }: SimpleLineChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((point.value - minValue) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  const latestValue = data[data.length - 1]?.value || 0
  const previousValue = data[data.length - 2]?.value || 0
  const change = latestValue - previousValue
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0

  const formatNumber = (num: number, type: "currency" | "percentage" | "number") => {
    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num)
    } else if (type === "percentage") {
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num / 100)
    } else {
      return new Intl.NumberFormat("en-US").format(num)
    }
  }

  const isRecentlyUpdated = recentUpdate && Date.now() - recentUpdate < 5000

  return (
    <Card className={`border border-border ${isRecentlyUpdated ? "card-active-glow" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {title}
            {isRecentlyUpdated && (
              <Badge className="bg-green-500/20 text-green-500 border-green-500 text-xs animate-pulse">UPDATED</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold">{formatNumber(latestValue, valueType)}</div>
      </CardHeader>
      <CardContent>
        <div className="h-20 w-full">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} className="drop-shadow-sm" />
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polygon fill={`url(#gradient-${title})`} points={`0,100 ${points} 100,100`} />
          </svg>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{ChartDataGenerator.formatTimestamp(data[0]?.timestamp || Date.now())}</span>
          <span>{ChartDataGenerator.formatTimestamp(data[data.length - 1]?.timestamp || Date.now())}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Link className="h-3 w-3 text-blue-500" />
          <span className="text-xs text-blue-500">Chainlink Data</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description?: string
  chainlinkService?: string
  isUpdated?: boolean
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
  chainlinkService,
  isUpdated,
}: MetricCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }[changeType]

  return (
    <Card className={`border border-border ${isUpdated ? "card-active-glow" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {title}
              {isUpdated && (
                <Badge className="bg-green-500/20 text-green-500 border-green-500 text-xs animate-pulse">LIVE</Badge>
              )}
            </p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs ${changeColor} flex items-center mt-1`}>
              {changeType === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
              {changeType === "negative" && <TrendingDown className="h-3 w-3 mr-1" />}
              {change}
            </p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {chainlinkService && (
              <div className="flex items-center gap-1 mt-1">
                <Link className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-500">{chainlinkService}</span>
              </div>
            )}
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DataVisualization({ visualUpdateTrigger }: DataVisualizationProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalValueProtected: 2847392,
    totalYieldGenerated: 156789,
    mevAttemptsBlocked: 1247,
    activeLiquidationAlerts: 3,
    chainlinkFeeds: 847,
    protectedVaults: 3,
  })
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0)

  // Handle visual updates from actions
  useEffect(() => {
    if (visualUpdateTrigger) {
      setRealTimeMetrics((prev) => ({
        ...prev,
        totalYieldGenerated:
          prev.totalYieldGenerated + (visualUpdateTrigger.yieldChange ? visualUpdateTrigger.yieldChange * 1000 : 0),
        mevAttemptsBlocked: prev.mevAttemptsBlocked + (visualUpdateTrigger.mevBlockedIncrease || 0),
        activeLiquidationAlerts: Math.max(
          0,
          prev.activeLiquidationAlerts +
            (visualUpdateTrigger.ltvChange ? (visualUpdateTrigger.ltvChange > 0 ? 1 : -1) : 0),
        ),
      }))
      setLastUpdateTimestamp(visualUpdateTrigger.timestamp)

      setHistoricalData((prev) => {
        if (!prev) return prev

        const newTimestamp = Date.now()
        const updatedData = { ...prev }

        if (visualUpdateTrigger.ltvChange) {
          const lastLTV = prev.ltv[prev.ltv.length - 1]?.value || 50
          updatedData.ltv = [
            ...prev.ltv,
            {
              timestamp: newTimestamp,
              value: Math.max(0, Math.min(100, lastLTV + visualUpdateTrigger.ltvChange)),
            },
          ].slice(-20)
        }

        if (visualUpdateTrigger.yieldChange) {
          const lastYield = prev.yield[prev.yield.length - 1]?.value || 100000
          updatedData.yield = [
            ...prev.yield,
            {
              timestamp: newTimestamp,
              value: lastYield + visualUpdateTrigger.yieldChange * 1000,
            },
          ].slice(-20)
        }

        if (visualUpdateTrigger.mevBlockedIncrease) {
          const lastMEV = prev.mevAttempts[prev.mevAttempts.length - 1]?.value || 50
          updatedData.mevAttempts = [
            ...prev.mevAttempts,
            {
              timestamp: newTimestamp,
              value: lastMEV + visualUpdateTrigger.mevBlockedIncrease,
            },
          ].slice(-20)
        }

        return updatedData
      })
    }
  }, [visualUpdateTrigger])

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      setTimeout(() => {
        const data = ChartDataGenerator.generateRealTimeData()
        setHistoricalData(data)
        setIsLoading(false)
      }, 1000)
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time metric updates (less frequent now)
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics((prev) => {
        const baseChange = Math.floor(Math.random() * 1000 - 500)
        const yieldIncrease = Math.floor(Math.random() * 200 + 50)
        const mevIncrease = Math.floor(Math.random() * 3 + 1)

        return {
          ...prev,
          totalValueProtected: Math.max(1000000, prev.totalValueProtected + baseChange),
          totalYieldGenerated: prev.totalYieldGenerated + yieldIncrease,
          mevAttemptsBlocked: prev.mevAttemptsBlocked + mevIncrease,
          activeLiquidationAlerts: Math.max(
            0,
            Math.min(10, prev.activeLiquidationAlerts + Math.floor(Math.random() * 3 - 1)),
          ),
          chainlinkFeeds: 847 + Math.floor(Math.random() * 10),
          protectedVaults: Math.max(1, Math.min(5, prev.protectedVaults + Math.floor(Math.random() * 3 - 1))),
        }
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading || !historicalData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border border-border">
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

  const isRecentlyUpdated = (timestamp: number) => Date.now() - timestamp < 5000

  return (
    <div className="space-y-6">
      {/* Enhanced Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Value Protected"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(realTimeMetrics.totalValueProtected)}
          change="+12.5% from last month"
          changeType="positive"
          icon={<Shield className="h-8 w-8" />}
          description="Across 3 vaults"
          chainlinkService="Proof of Reserve"
          isUpdated={isRecentlyUpdated(lastUpdateTimestamp)}
        />
        <MetricCard
          title="Yield Generated"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(realTimeMetrics.totalYieldGenerated)}
          change="+8.3% from last month"
          changeType="positive"
          icon={<DollarSign className="h-8 w-8" />}
          description="Optimized strategies"
          chainlinkService="Functions"
          isUpdated={isRecentlyUpdated(lastUpdateTimestamp)}
        />
        <MetricCard
          title="MEV Attacks Blocked"
          value={new Intl.NumberFormat("en-US").format(realTimeMetrics.mevAttemptsBlocked)}
          change="+23.1% from last month"
          changeType="positive"
          icon={<Activity className="h-8 w-8" />}
          description="Real-time protection"
          chainlinkService="VRF + Functions"
          isUpdated={isRecentlyUpdated(lastUpdateTimestamp)}
        />
        <MetricCard
          title="Active Alerts"
          value={new Intl.NumberFormat("en-US").format(realTimeMetrics.activeLiquidationAlerts)}
          change="-2 from yesterday"
          changeType="positive"
          icon={<AlertTriangle className="h-8 w-8" />}
          description="24/7 monitoring"
          chainlinkService="Automation"
        />
        <MetricCard
          title="Chainlink Feeds"
          value={new Intl.NumberFormat("en-US").format(realTimeMetrics.chainlinkFeeds)}
          change="All operational"
          changeType="positive"
          icon={<Eye className="h-8 w-8" />}
          description="Price feeds synchronized"
          chainlinkService="Price Feeds"
        />
        <MetricCard
          title="Protected Vaults"
          value={new Intl.NumberFormat("en-US").format(realTimeMetrics.protectedVaults)}
          change="100% coverage"
          changeType="positive"
          icon={<Zap className="h-8 w-8" />}
          description="Automation active"
          chainlinkService="Automation"
        />
      </div>

      {/* Enhanced Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="liquidation">Liquidation Risk</TabsTrigger>
          <TabsTrigger value="yield">Yield Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={historicalData.ltv}
              title="Average LTV Ratio"
              color="#6366f1"
              valueType="percentage"
              recentUpdate={visualUpdateTrigger?.ltvChange ? lastUpdateTimestamp : undefined}
            />
            <SimpleLineChart
              data={historicalData.yield}
              title="Cumulative Yield"
              color="#10b981"
              valueType="currency"
              recentUpdate={visualUpdateTrigger?.yieldChange ? lastUpdateTimestamp : undefined}
            />
            <SimpleLineChart
              data={historicalData.mevAttempts}
              title="Daily MEV Attempts"
              color="#f59e0b"
              valueType="number"
              recentUpdate={visualUpdateTrigger?.mevBlockedIncrease ? lastUpdateTimestamp : undefined}
            />
            <SimpleLineChart
              data={historicalData.priceFeeds}
              title="ETH Price Feed"
              color="#8b5cf6"
              valueType="currency"
            />
          </div>
        </TabsContent>

        <TabsContent value="liquidation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={historicalData.ltv}
              title="LTV Trend (30 Days)"
              color="#ef4444"
              valueType="percentage"
              recentUpdate={visualUpdateTrigger?.ltvChange ? lastUpdateTimestamp : undefined}
            />
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Liquidation Risk Distribution
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Chainlink Monitored
                  </Badge>
                </CardTitle>
                <CardDescription>Current vault risk levels via Chainlink monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Safe (LTV &lt; 60%)</span>
                    </div>
                    <Badge variant="secondary">2 vaults</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Moderate (60-75%)</span>
                    </div>
                    <Badge variant="secondary">1 vault</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">High Risk (&gt; 75%)</span>
                    </div>
                    <Badge variant="destructive">0 vaults</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yield" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={historicalData.yield}
              title="Yield Performance"
              color="#10b981"
              valueType="currency"
              recentUpdate={visualUpdateTrigger?.yieldChange ? lastUpdateTimestamp : undefined}
            />
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Top Performing Strategies
                  <Badge className="bg-green-500/20 text-green-500 border-green-500 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Functions Analyzed
                  </Badge>
                </CardTitle>
                <CardDescription>Best APR via Chainlink Functions analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Convex stETH</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      6.8% APR
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Yearn USDT</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      5.2% APR
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aave USDC</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">4.5% APR</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compound DAI</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">3.8% APR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={historicalData.mevAttempts}
              title="MEV Attempts Blocked"
              color="#f59e0b"
              valueType="number"
              recentUpdate={visualUpdateTrigger?.mevBlockedIncrease ? lastUpdateTimestamp : undefined}
            />
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Attack Types Detected
                  <Badge className="bg-red-500/20 text-red-500 border-red-500 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    VRF Verified
                  </Badge>
                </CardTitle>
                <CardDescription>Last 30 days via Chainlink monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Frontrunning</span>
                    <Badge variant="destructive">67%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sandwich Attacks</span>
                    <Badge variant="destructive">23%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Backrunning</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
