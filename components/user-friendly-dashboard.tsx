"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ActionButton } from "./action-button"
import { ElizaChatPanel } from "./eliza-chat-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Cpu,
  Shield,
  Eye,
  TrendingUp,
  Zap,
  Wifi,
  WifiOff,
  Activity,
  AlertTriangle,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  Link,
  Database,
  Shuffle,
  BarChart3,
  Timer,
} from "lucide-react"
import { simulateAction, triggerProactiveAlert } from "@/lib/simulated-engine"
import { toast } from "sonner"
import { DataVisualization } from "./data-visualization"

interface UserFriendlyDashboardProps {
  initialAuditLogs?: string[]
  isConnected?: boolean
  onConnectWallet?: () => void
  onAction?: (action: string) => void
  onAddAuditLog: (log: string) => void
  currentStep?: number
  vaultHealth?: number
  riskLevel?: "LOW" | "MEDIUM" | "HIGH"
  isDemo?: boolean
  aiRecommendedAction?: string | null
  auditLogs?: string[]
  elizaStatus?: "ACTIVE" | "SCANNING" | "IDLE"
  onElizaStatusChange?: (status: "ACTIVE" | "SCANNING" | "IDLE") => void
  getElizaAIResponse?: (options: any) => Promise<any>
  systemActionMessage?: {
    message: string
    type: "success" | "warning" | "info" | "error"
    reasoning: string
  } | null
}

export const UserFriendlyDashboard: React.FC<UserFriendlyDashboardProps> = ({
  initialAuditLogs,
  isConnected: propIsConnected,
  onConnectWallet: propOnConnectWallet,
  onAction: propOnAction,
  onAddAuditLog,
  currentStep: propCurrentStep,
  vaultHealth: propVaultHealth,
  riskLevel: propRiskLevel,
  isDemo: propIsDemo,
  aiRecommendedAction: propAiRecommendedAction,
  auditLogs: propAuditLogs,
  elizaStatus: propElizaStatus,
  onElizaStatusChange: propOnElizaStatusChange,
  getElizaAIResponse: propGetElizaAIResponse,
  systemActionMessage: propSystemActionMessage,
}) => {
  // Use props if provided, otherwise use internal state (for backward compatibility)
  const [internalAuditLogs, setInternalAuditLogs] = useState<string[]>(initialAuditLogs || [])
  const [internalCurrentStep, setInternalCurrentStep] = useState<number>(propCurrentStep || 0)
  const [internalElizaStatus, setInternalElizaStatus] = useState<"ACTIVE" | "SCANNING" | "IDLE">(
    propElizaStatus || "IDLE",
  )
  const [internalAiRecommendedAction, setInternalAiRecommendedAction] = useState<string | null>(
    propAiRecommendedAction || null,
  )
  const [internalSystemActionMessage, setInternalSystemActionMessage] = useState<{
    message: string
    type: "success" | "warning" | "info" | "error"
    reasoning: string
  } | null>(propSystemActionMessage || null)

  const [internalIsWalletConnected, setInternalIsWalletConnected] = useState<boolean>(propIsConnected || false)
  const [vaultsDetected, setVaultsDetected] = useState<number>(0)
  const [isDetecting, setIsDetecting] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Use props or internal state
  const auditLogs = propAuditLogs || internalAuditLogs
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : internalCurrentStep
  const elizaStatus = propElizaStatus || internalElizaStatus
  const aiRecommendedAction =
    propAiRecommendedAction !== undefined ? propAiRecommendedAction : internalAiRecommendedAction
  const systemActionMessage = propSystemActionMessage || internalSystemActionMessage
  const isWalletConnected = propIsConnected !== undefined ? propIsConnected : internalIsWalletConnected

  // Enhanced Chainlink services state with accurate structure
  const [chainlinkServices, setChainlinkServices] = useState<{
    dataFeeds: {
      active: number
      pairs: string[]
      lastUpdate: number
      priceChanges?: Record<string, number>
    }
    dataStreams: {
      active: number
      lowLatencyFeeds: number
      volatilityDetected?: boolean
      mevDetectionActive?: boolean
      exploitationWindow?: string
    }
    vrf: {
      requests: number
      randomnessGenerated: number
      attackScenariosGenerated?: number
      lastRequest?: number
    }
    proofOfReserve: {
      verified: boolean
      totalCollateral: number
      lastCheck: number
    }
    automation: {
      upkeepContracts: number
      executionsToday: number
      triggers?: string[]
      nextCheck?: number
    }
    functions: {
      deployed: number
      computationsToday: number
      lastCalculation?: string
      protocolsAnalyzed?: number
      apiCalls?: number
      defenseStrategiesComputed?: number
      successRate?: number
    }
    ccip: {
      crossChainMessages: number
      supportedChains: number
    }
  }>({
    dataFeeds: { active: 0, pairs: [], lastUpdate: 0 },
    dataStreams: { active: 0, lowLatencyFeeds: 0 },
    vrf: { requests: 0, randomnessGenerated: 0 },
    proofOfReserve: { verified: false, totalCollateral: 0, lastCheck: 0 },
    automation: { upkeepContracts: 0, executionsToday: 0 },
    functions: { deployed: 0, computationsToday: 0 },
    ccip: { crossChainMessages: 0, supportedChains: 0 },
  })

  const [vaultDetails, setVaultDetails] = useState<{
    totalValue: number
    riskScore: number
    ltvRatio: number
    protectionLevel: string
    currentYield: number
    mevBlocked: number
    activeAlerts: number
  }>({
    totalValue: 0,
    riskScore: 0,
    ltvRatio: 0,
    protectionLevel: "None",
    currentYield: 0,
    mevBlocked: 0,
    activeAlerts: 0,
  })

  const [isProactiveMode, setIsProactiveMode] = useState<boolean>(true)
  const [autoActionPending, setAutoActionPending] = useState<string | null>(null)
  const [autoActionCountdown, setAutoActionCountdown] = useState<number>(0)
  const [lastChainlinkServicesUsed, setLastChainlinkServicesUsed] = useState<string[]>([])

  const [dataVisualizationTrigger, setDataVisualizationTrigger] = useState<{
    ltvChange?: number
    yieldChange?: number
    riskScoreChange?: number
    mevBlockedIncrease?: number
    timestamp: number
  } | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sync with external props
  useEffect(() => {
    if (propIsConnected !== undefined) {
      setInternalIsWalletConnected(propIsConnected)
    }
  }, [propIsConnected])

  useEffect(() => {
    if (propElizaStatus) {
      setInternalElizaStatus(propElizaStatus)
    }
  }, [propElizaStatus])

  useEffect(() => {
    if (propAiRecommendedAction !== undefined) {
      setInternalAiRecommendedAction(propAiRecommendedAction)
    }
  }, [propAiRecommendedAction])

  useEffect(() => {
    if (propSystemActionMessage) {
      setInternalSystemActionMessage(propSystemActionMessage)
    }
  }, [propSystemActionMessage])

  // Proactive monitoring with Chainlink service awareness
  useEffect(() => {
    if (!isWalletConnected || !vaultsDetected || !isProactiveMode) return

    const proactiveCheck = async () => {
      const alert = await triggerProactiveAlert(vaultDetails.riskScore, vaultDetails.ltvRatio)
      if (alert && !autoActionPending) {
        setInternalSystemActionMessage({
          message: alert.message,
          type: alert.type,
          reasoning: alert.reasoning,
        })

        // Always use onAddAuditLog for new logs
        onAddAuditLog(`🤖 PROACTIVE ALERT: ${alert.message}`)
        onAddAuditLog(`🔗 Services Triggered: ${alert.chainlinkServicesTriggered?.join(", ")}`)

        toast[alert.type](alert.message, { description: alert.reasoning })

        if (alert.urgency === "critical") {
          setAutoActionPending(alert.autoAction)
          setAutoActionCountdown(10)
          setInternalAiRecommendedAction(alert.autoAction)
        } else {
          setInternalAiRecommendedAction(alert.autoAction)
        }
      }
    }

    const interval = setInterval(proactiveCheck, 15000)
    return () => clearInterval(interval)
  }, [
    isWalletConnected,
    vaultsDetected,
    vaultDetails.riskScore,
    vaultDetails.ltvRatio,
    isProactiveMode,
    autoActionPending,
    onAddAuditLog,
  ])

  useEffect(() => {
    if (autoActionCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoActionCountdown(autoActionCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (autoActionCountdown === 0 && autoActionPending) {
      handleTriggerAction(autoActionPending, true)
      setAutoActionPending(null)
    }
  }, [autoActionCountdown, autoActionPending])

  useEffect(() => {
    if (isWalletConnected && vaultsDetected > 0 && aiRecommendedAction === null) {
      const timeoutId = setTimeout(() => {
        setInternalAiRecommendedAction("Scan Vault")
      }, 3000)
      return () => clearTimeout(timeoutId)
    }
  }, [isWalletConnected, vaultsDetected, aiRecommendedAction])

  const handleTriggerAction = async (action: string, isAutoTriggered = false) => {
    const logPrefix = isAutoTriggered ? "🤖 AUTO-TRIGGERED" : "👤 USER INITIATED"
    onAddAuditLog(`${logPrefix}: ${action}`)

    setInternalCurrentStep((prevStep) => prevStep + 1)

    // Use external or internal eliza status
    if (propOnElizaStatusChange) {
      propOnElizaStatusChange("SCANNING")
    } else {
      setInternalElizaStatus("SCANNING")
    }

    try {
      const result = await simulateAction(action, true)

      // Log Chainlink services used
      if (result.chainlinkServicesUsed && result.chainlinkServicesUsed.length > 0) {
        setLastChainlinkServicesUsed(result.chainlinkServicesUsed)
        onAddAuditLog(`🔗 Chainlink Services Used: ${result.chainlinkServicesUsed.join(", ")}`)
      }

      // Handle wallet connection
      if (action === "Connect Wallet") {
        if (propOnConnectWallet) {
          propOnConnectWallet()
        } else {
          setInternalIsWalletConnected(true)
        }

        setIsDetecting(true)
        setChainlinkServices(result.additionalData?.chainlinkServices || chainlinkServices)

        setTimeout(() => {
          setVaultsDetected(result.additionalData?.vaultsDetected || 3)
          setVaultDetails((prev) => ({
            ...prev,
            totalValue: result.additionalData?.totalValue || 2800000,
            protectionLevel: "Basic",
          }))
          setIsDetecting(false)

          onAddAuditLog("🔗 Chainlink Proof of Reserve verified $2.8M in collateral")

          if (aiRecommendedAction === null) {
            setInternalAiRecommendedAction("Scan Vault")
          }
        }, 2500)
      }

      // Apply visual updates immediately
      if (result.visualUpdates) {
        setVaultDetails((prev) => ({
          ...prev,
          riskScore: Math.max(0, Math.min(100, prev.riskScore + (result.visualUpdates.riskScoreChange || 0))),
          ltvRatio: Math.max(0, Math.min(100, prev.ltvRatio + (result.visualUpdates.ltvChange || 0))),
          currentYield: Math.max(0, prev.currentYield + (result.visualUpdates.yieldChange || 0)),
          mevBlocked: prev.mevBlocked + (result.visualUpdates.mevBlockedIncrease || 0),
          activeAlerts: Math.max(0, prev.activeAlerts + (result.visualUpdates.alertsChange || 0)),
        }))

        setDataVisualizationTrigger({
          ...result.visualUpdates,
          timestamp: Date.now(),
        })
      }

      // Update Chainlink services
      if (result.additionalData?.chainlinkServices) {
        setChainlinkServices(result.additionalData.chainlinkServices)
      }

      // Update other vault details
      if (result.additionalData) {
        setVaultDetails((prev) => ({
          ...prev,
          riskScore: result.additionalData.riskScore ?? prev.riskScore,
          ltvRatio: result.additionalData.ltvRatio ?? prev.ltvRatio,
          protectionLevel: result.additionalData.protectionLevel || prev.protectionLevel,
        }))
      }

      setInternalSystemActionMessage(result)

      onAddAuditLog(`✅ ${action}: ${result.message}`)

      toast[result.type](result.message, { description: result.reasoning })

      if (result.additionalData?.recommendation) {
        setInternalAiRecommendedAction(result.additionalData.recommendation)
      } else if (action === aiRecommendedAction) {
        setInternalAiRecommendedAction(null)
      }

      if (result.additionalData?.urgentAction && !isAutoTriggered) {
        setAutoActionPending(result.additionalData.recommendation)
        setAutoActionCountdown(8)
      }
    } catch (error: any) {
      const errorMessage = error.message || `Failed to ${action}.`
      setInternalSystemActionMessage({ message: errorMessage, type: "error", reasoning: "Simulation failed." })

      onAddAuditLog(`❌ ${action}: ${errorMessage}`)

      toast.error(errorMessage, { description: "Please check system logs." })
      setInternalAiRecommendedAction(null)
    } finally {
      if (propOnElizaStatusChange) {
        propOnElizaStatusChange("ACTIVE")
      } else {
        setInternalElizaStatus("ACTIVE")
      }
    }
  }

  const getElizaAIResponse = async (options: {
    userMessage: string
    elizaStatus: "ACTIVE" | "SCANNING" | "IDLE"
    currentStep: number
    aiRecommendedAction: string | null
    auditLogsSummary: string
  }) => {
    if (propGetElizaAIResponse) {
      return await propGetElizaAIResponse(options)
    }

    // Fallback to API call
    const response = await fetch("/api/eliza-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })
    const data = await response.json()
    return data
  }

  const handleElizaStatusChange = (status: "ACTIVE" | "SCANNING" | "IDLE") => {
    if (propOnElizaStatusChange) {
      propOnElizaStatusChange(status)
    } else {
      setInternalElizaStatus(status)
    }
  }

  // Updated agents with accurate Chainlink service mapping
  const agents = [
    {
      name: "Oracle Guardian",
      status: chainlinkServices.dataFeeds.active > 0 ? "ACTIVE" : "STANDBY",
      performance: 98.5,
      lastAction: `Monitoring ${chainlinkServices.dataFeeds.pairs?.length || 0} price pairs`,
      icon: Eye,
      color: "text-blue-500",
      chainlinkService: "Data Feeds",
      serviceIcon: Database,
      serviceCount: chainlinkServices.dataFeeds.active,
    },
    {
      name: "MEV Protector",
      status: chainlinkServices.dataStreams.mevDetectionActive ? "SCANNING" : "INACTIVE",
      performance: 94.2,
      lastAction: `${chainlinkServices.dataStreams.lowLatencyFeeds} low-latency feeds active`,
      icon: Shield,
      color: "text-red-500",
      chainlinkService: "Data Streams",
      serviceIcon: Zap,
      serviceCount: chainlinkServices.dataStreams.active,
    },
    {
      name: "Liquidation Guard",
      status: chainlinkServices.automation.upkeepContracts > 0 ? "PROTECTED" : "INACTIVE",
      performance: 96.8,
      lastAction: `${chainlinkServices.automation.upkeepContracts} automation contracts deployed`,
      icon: Lock,
      color: "text-yellow-500",
      chainlinkService: "Automation",
      serviceIcon: Timer,
      serviceCount: chainlinkServices.automation.upkeepContracts,
    },
    {
      name: "Yield Optimizer",
      status: chainlinkServices.functions.deployed > 0 ? "OPTIMIZING" : "INACTIVE",
      performance: 91.3,
      lastAction: `${chainlinkServices.functions.computationsToday} computations today`,
      icon: TrendingUp,
      color: "text-green-500",
      chainlinkService: "Functions",
      serviceIcon: BarChart3,
      serviceCount: chainlinkServices.functions.deployed,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "OPTIMIZING":
      case "PROTECTED":
        return <CheckCircle className="h-4 w-4" />
      case "SCANNING":
      case "MONITORING":
        return <Activity className="h-4 w-4 animate-pulse" />
      case "ALERT":
        return <AlertTriangle className="h-4 w-4" />
      case "STANDBY":
        return <Clock className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "OPTIMIZING":
      case "PROTECTED":
        return "bg-green-500/20 text-green-500 border-green-500"
      case "SCANNING":
      case "MONITORING":
        return "bg-amber-500/20 text-amber-500 border-amber-500"
      case "ALERT":
        return "bg-red-500/20 text-red-500 border-red-500"
      case "STANDBY":
        return "bg-gray-500/20 text-gray-500 border-gray-500"
      case "INACTIVE":
        return "bg-red-500/20 text-red-500 border-red-500"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500"
    }
  }

  // Updated simulation tests with accurate Chainlink service mapping
  const simulationTests = [
    {
      id: "scan",
      title: "Vault Scanner",
      description: "Analyze positions via Data Feeds + Functions",
      icon: Eye,
      action: "Scan Vault",
      color: "blue",
      chainlinkServices: ["Data Feeds", "Data Streams", "Functions"],
      serviceIcons: [Database, Zap, BarChart3],
    },
    {
      id: "protect",
      title: "Anti-Liquidation",
      description: "Deploy Automation + Data Feed monitoring",
      icon: Shield,
      action: "Activate Anti-Liquidation",
      color: "green",
      chainlinkServices: ["Automation", "Data Feeds", "Functions"],
      serviceIcons: [Timer, Database, BarChart3],
    },
    {
      id: "optimize",
      title: "Yield Optimizer",
      description: "Functions compute optimal strategies",
      icon: TrendingUp,
      action: "Optimize Yield",
      color: "purple",
      chainlinkServices: ["Functions", "Data Feeds"],
      serviceIcons: [BarChart3, Database],
    },
    {
      id: "attack",
      title: "Security Test",
      description: "VRF generates random attack scenarios",
      icon: Zap,
      action: "Simulate Attack",
      color: "red",
      chainlinkServices: ["VRF", "Functions", "Data Streams"],
      serviceIcons: [Shuffle, BarChart3, Zap],
    },
  ]

  return (
    <div className="flex h-screen w-full">
      {/* Main Dashboard Content - 3/4 width */}
      <div className="w-3/4 overflow-y-auto">
        <div className="min-h-screen p-6 space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">SUPER ELIZA AI GUARD</h1>
            <p className="text-lg text-muted-foreground">
              AI-Powered DeFi Protection • Secured by Chainlink Network • ⏱️ Live Data:{" "}
              {currentTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} UTC
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <Badge variant={isWalletConnected ? "default" : "secondary"} className="flex items-center gap-2">
                {isWalletConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isWalletConnected ? "Wallet Connected" : "Wallet Disconnected"}
              </Badge>
              {isWalletConnected && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  {isDetecting ? "Detecting Vaults..." : `${vaultsDetected} Vaults Detected`}
                </Badge>
              )}
              {isProactiveMode && isWalletConnected && (
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 flex items-center gap-2">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Proactive AI Active
                </Badge>
              )}
              {lastChainlinkServicesUsed.length > 0 && (
                <Badge className="bg-purple-500/20 text-purple-500 border-purple-500 flex items-center gap-2">
                  <Link className="h-3 w-3" />
                  Last Used: {lastChainlinkServicesUsed.join(", ")}
                </Badge>
              )}
            </div>
          </div>
          {/* Auto-Action Countdown Alert */}
          {autoActionPending && autoActionCountdown > 0 && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-1">
                      🤖 CHAINLINK AUTO-PROTECTION ACTIVATING
                    </h3>
                    <p className="text-foreground">
                      Automation Keepers will execute "{autoActionPending}" in {autoActionCountdown} seconds...
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setAutoActionPending(null)
                      setAutoActionCountdown(0)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Wallet Connection Section */}
          {!isWalletConnected && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 card-glow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <WifiOff className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2">
                  Connect Your Wallet to Begin
                </h3>
                <p className="text-amber-600 dark:text-amber-400 mb-4">
                  Chainlink Proof of Reserve will verify and monitor all your DeFi positions
                </p>
                <Button
                  onClick={() => handleTriggerAction("Connect Wallet")}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          )}
          {/* AI Recommendation */}
          {aiRecommendedAction && aiRecommendedAction !== "Loading..." && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      🤖 AI RECOMMENDATION
                    </h3>
                    <p className="text-foreground">
                      Ready to {aiRecommendedAction.toLowerCase()}? Powered by Chainlink intelligence.
                    </p>
                  </div>
                  <ActionButton label="EXECUTE" onClick={() => handleTriggerAction(aiRecommendedAction)} />
                </div>
              </CardContent>
            </Card>
          )}
          {/* Real-time Vault Metrics */}
          {isWalletConnected && vaultsDetected > 0 && (
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Vault Metrics
                  <Badge className="bg-green-500/20 text-green-500 border-green-500 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Chainlink Live Data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{vaultDetails.riskScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Risk Score</div>
                    <div className="text-xs text-red-500 flex items-center justify-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Functions Analysis
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{vaultDetails.ltvRatio.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Current LTV</div>
                    <div className="text-xs text-yellow-500 flex items-center justify-center gap-1">
                      <Database className="h-3 w-3" />
                      Data Feeds
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{vaultDetails.currentYield.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Current APY</div>
                    <div className="text-xs text-green-500 flex items-center justify-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Functions Optimized
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{vaultDetails.mevBlocked}</div>
                    <div className="text-sm text-muted-foreground">MEV Blocked</div>
                    <div className="text-xs text-blue-500 flex items-center justify-center gap-1">
                      <Shuffle className="h-3 w-3" />
                      VRF Protected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Guardian Agents */}
          {isWalletConnected && vaultsDetected > 0 && (
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Guardian Agents Status
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 text-xs">
                    <Link className="h-3 w-3 mr-1" />
                    Chainlink Powered
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {agents.map((agent, index) => {
                    const IconComponent = agent.icon
                    const ServiceIconComponent = agent.serviceIcon
                    return (
                      <Card key={index} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <IconComponent className={`h-7 w-7 ${agent.color}`} />
                            <Badge className={`${getStatusClass(agent.status)} text-xs`}>
                              {getStatusIcon(agent.status)}
                              {agent.status}
                            </Badge>
                          </div>
                          <h3 className="text-md font-semibold mb-1 text-foreground">{agent.name}</h3>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-0.5 text-muted-foreground">
                                <span>Performance</span>
                                <span className={`${agent.color}`}>{agent.performance}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div
                                  className={`h-1.5 rounded-full bg-${agent.color.split("-")[1]}-500`}
                                  style={{ width: `${agent.performance}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{agent.lastAction}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <ServiceIconComponent className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-500">{agent.chainlinkService}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {agent.serviceCount}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Detailed Chainlink Services Status */}
          {isWalletConnected && vaultsDetected > 0 && (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-blue-600" />
                  Chainlink Network Services
                  <Badge className="bg-green-500/20 text-green-500 border-green-500 text-xs">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    All Systems Operational
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">Data Feeds</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{chainlinkServices.dataFeeds.active}</div>
                    <div className="text-sm text-muted-foreground">Active Price Feeds</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {chainlinkServices.dataFeeds.pairs?.slice(0, 3).join(", ") || "No pairs"}
                      {(chainlinkServices.dataFeeds.pairs?.length || 0) > 3 && "..."}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-600">Data Streams</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{chainlinkServices.dataStreams.active}</div>
                    <div className="text-sm text-muted-foreground">Low-Latency Feeds</div>
                    <div className="text-xs text-orange-500 mt-1">
                      {chainlinkServices.dataStreams.mevDetectionActive ? "MEV Detection Active" : "Monitoring"}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-600">Automation</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {chainlinkServices.automation.upkeepContracts}
                    </div>
                    <div className="text-sm text-muted-foreground">Upkeep Contracts</div>
                    <div className="text-xs text-green-500 mt-1">
                      {chainlinkServices.automation.executionsToday} executions today
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-600">Functions</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{chainlinkServices.functions.deployed}</div>
                    <div className="text-sm text-muted-foreground">Deployed Functions</div>
                    <div className="text-xs text-purple-500 mt-1">
                      {chainlinkServices.functions.computationsToday} computations today
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shuffle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-600">VRF</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{chainlinkServices.vrf.requests}</div>
                    <div className="text-sm text-muted-foreground">VRF Requests</div>
                    <div className="text-xs text-red-500 mt-1">
                      {chainlinkServices.vrf.randomnessGenerated} random values generated
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-teal-600">Proof of Reserve</span>
                    </div>
                    <div className="text-2xl font-bold text-teal-600">
                      {chainlinkServices.proofOfReserve.verified ? "✓" : "✗"}
                    </div>
                    <div className="text-sm text-muted-foreground">Collateral Verified</div>
                    <div className="text-xs text-teal-500 mt-1">
                      ${(chainlinkServices.proofOfReserve.totalCollateral / 1000000).toFixed(1)}M secured
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Simulation Tests */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Chainlink-Powered Simulation Tests
                <Badge className="bg-purple-500/20 text-purple-500 border-purple-500 text-xs">
                  <Link className="h-3 w-3 mr-1" />
                  Multi-Service Integration
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {simulationTests.map((test) => {
                  const IconComponent = test.icon
                  return (
                    <Card key={test.id} className="border border-border hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <IconComponent className={`h-6 w-6 text-${test.color}-500`} />
                          <div className="flex gap-1">
                            {test.serviceIcons.map((ServiceIcon, idx) => (
                              <ServiceIcon key={idx} className="h-3 w-3 text-blue-500" />
                            ))}
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold mb-2 text-foreground">{test.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{test.description}</p>
                        <div className="space-y-2">
                          <div className="text-xs text-blue-500">Services: {test.chainlinkServices.join(", ")}</div>
                          <ActionButton
                            label="RUN TEST"
                            onClick={() => handleTriggerAction(test.action)}
                            size="sm"
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          {/* Data Visualization */}
          {isWalletConnected && vaultsDetected > 0 && (
            <DataVisualization
              vaultDetails={vaultDetails}
              chainlinkServices={chainlinkServices}
              trigger={dataVisualizationTrigger}
            />
          )}
        </div>
      </div>

      {/* Eliza Chat Panel - 1/4 width, docked on the right */}
      <ElizaChatPanel
        onTriggerAction={handleTriggerAction}
        auditLogs={auditLogs}
        currentStep={currentStep}
        elizaStatus={elizaStatus}
        onStatusChange={handleElizaStatusChange}
        aiRecommendedAction={aiRecommendedAction}
        getElizaAIResponse={getElizaAIResponse}
        systemActionMessage={systemActionMessage}
      />
    </div>
  )
}
