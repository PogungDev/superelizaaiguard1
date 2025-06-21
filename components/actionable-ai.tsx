"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Bot, Shield, TrendingUp, CheckCircle, Clock, Zap, Target, DollarSign, Activity } from "lucide-react"
import { web3Simulator } from "@/lib/web3-integration"

interface AIRecommendation {
  id: string
  type: "liquidation" | "yield" | "mev" | "oracle"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  action: string
  reasoning: string[]
  estimatedImpact: string
  canExecute: boolean
  isExecuting?: boolean
  isCompleted?: boolean
}

interface ActionableAIProps {
  onActionExecuted?: (recommendation: AIRecommendation) => void
}

export function ActionableAI({ onActionExecuted }: ActionableAIProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set())

  useEffect(() => {
    generateRecommendations()

    // Update recommendations every 60 seconds
    const interval = setInterval(generateRecommendations, 60000)
    return () => clearInterval(interval)
  }, [])

  const generateRecommendations = async () => {
    setIsLoading(true)

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newRecommendations: AIRecommendation[] = [
      {
        id: "liq-001",
        type: "liquidation",
        priority: "high",
        title: "Activate Anti-Liquidation Protocol",
        description: "Vault 0x1234...abcd is approaching liquidation threshold (78% LTV)",
        action: "Add Collateral",
        reasoning: [
          "Current LTV ratio is 78%, approaching 80% liquidation threshold",
          "ETH price has dropped 3.2% in the last 4 hours",
          "Chainlink price feed shows continued downward pressure",
          "Auto-rebalancing would reduce risk to 65% LTV",
        ],
        estimatedImpact: "Prevent $12,450 liquidation loss",
        canExecute: true,
      },
      {
        id: "yield-001",
        type: "yield",
        priority: "medium",
        title: "Optimize Yield Strategy",
        description: "Better yield opportunity detected in Convex stETH pool",
        action: "Switch Strategy",
        reasoning: [
          "Current Aave USDC position earning 4.5% APR",
          "Convex stETH pool now offering 6.8% APR",
          "Risk score remains within acceptable range (7/10)",
          "Expected additional yield: $234/month",
        ],
        estimatedImpact: "+$2,808 annual yield increase",
        canExecute: true,
      },
      {
        id: "mev-001",
        type: "mev",
        priority: "high",
        title: "MEV Attack Detected",
        description: "Suspicious frontrunning attempt on your pending transaction",
        action: "Cancel & Resubmit",
        reasoning: [
          "Transaction 0x5678...efgh detected in mempool",
          "Attacker attempting to frontrun with 150% gas price",
          "Estimated MEV extraction: $890",
          "Recommended: Cancel and resubmit with private mempool",
        ],
        estimatedImpact: "Save $890 from MEV extraction",
        canExecute: true,
      },
      {
        id: "oracle-001",
        type: "oracle",
        priority: "low",
        title: "Price Feed Anomaly",
        description: "Unusual price deviation detected in USDC/USD feed",
        action: "Monitor",
        reasoning: [
          "USDC/USD feed showing 0.9995, deviation from expected 1.0000",
          "Other stablecoin feeds remain stable",
          "Possible temporary oracle lag or market event",
          "Monitoring for 15 minutes before action",
        ],
        estimatedImpact: "Prevent potential arbitrage loss",
        canExecute: false,
      },
    ]

    setRecommendations(newRecommendations)
    setIsLoading(false)
  }

  const executeAction = async (recommendation: AIRecommendation) => {
    if (!recommendation.canExecute || executingActions.has(recommendation.id)) return

    setExecutingActions((prev) => new Set(prev).add(recommendation.id))

    try {
      // Simulate action execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update recommendation status
      setRecommendations((prev) =>
        prev.map((rec) => (rec.id === recommendation.id ? { ...rec, isCompleted: true, isExecuting: false } : rec)),
      )

      // Execute specific actions based on type
      switch (recommendation.type) {
        case "liquidation":
          // Simulate adding collateral
          console.log("Executing liquidation protection...")
          break
        case "yield":
          // Simulate strategy switch
          await web3Simulator.executeRebalance("user-123", 2) // Switch to Convex stETH
          console.log("Executing yield optimization...")
          break
        case "mev":
          // Simulate MEV protection
          await web3Simulator.reportMEVAttempt({
            originalTxHash: "0x5678...efgh",
            attacker: "0x9abc...def0",
            attemptedProfit: 890,
            attackType: "frontrun",
          })
          console.log("Executing MEV protection...")
          break
        case "oracle":
          // Simulate oracle monitoring
          console.log("Monitoring oracle feeds...")
          break
      }

      onActionExecuted?.(recommendation)
    } catch (error) {
      console.error("Action execution failed:", error)
    } finally {
      setExecutingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(recommendation.id)
        return newSet
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "liquidation":
        return <Shield className="h-4 w-4" />
      case "yield":
        return <TrendingUp className="h-4 w-4" />
      case "mev":
        return <Activity className="h-4 w-4" />
      case "oracle":
        return <Target className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle>ElizaOS AI Recommendations</CardTitle>
          </div>
          <CardDescription>Analyzing your positions and market conditions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle>ElizaOS AI Recommendations</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>{recommendations.filter((r) => r.canExecute && !r.isCompleted).length} actionable</span>
          </Badge>
        </div>
        <CardDescription>
          AI-powered recommendations based on real-time analysis of your positions and market conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={recommendation.id}>
              <Alert
                className={`${
                  recommendation.priority === "high"
                    ? "border-red-200 bg-red-50"
                    : recommendation.priority === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeIcon(recommendation.type)}
                      <Badge variant={getPriorityColor(recommendation.priority)} size="sm">
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                        {recommendation.isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <AlertDescription className="text-sm mb-3">{recommendation.description}</AlertDescription>

                      <div className="space-y-2 mb-3">
                        <div className="text-xs font-medium text-muted-foreground">AI Reasoning:</div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {recommendation.reasoning.map((reason, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span className="font-medium text-green-600">{recommendation.estimatedImpact}</span>
                        </div>

                        {recommendation.canExecute && !recommendation.isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => executeAction(recommendation)}
                            disabled={executingActions.has(recommendation.id)}
                            className="ml-2"
                          >
                            {executingActions.has(recommendation.id) ? (
                              <>
                                <Clock className="h-3 w-3 mr-1 animate-spin" />
                                Executing...
                              </>
                            ) : (
                              <>
                                <Zap className="h-3 w-3 mr-1" />
                                {recommendation.action}
                              </>
                            )}
                          </Button>
                        )}

                        {!recommendation.canExecute && (
                          <Badge variant="outline" size="sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Monitoring
                          </Badge>
                        )}

                        {recommendation.isCompleted && (
                          <Badge variant="outline" size="sm" className="text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
              {index < recommendations.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations at this time.</p>
            <p className="text-sm">ElizaOS is monitoring your positions for optimization opportunities.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
