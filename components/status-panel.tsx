"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Search, Repeat, DollarSign, Brain, Dna, CheckCircle, XCircle, Clock } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface StatusPanelProps {
  engineStatus: {
    guardianActive: boolean
    riskCheckStatus: string
    liquidationStatus: string
    aiReasoning: string
    scanSource: string
    chainlinkModules: {
      dataFeeds: boolean
      priceFeeds: boolean
      vrf: boolean
      keepers: boolean
      functions: boolean
      automation: boolean
      crossChain: boolean
    }
    elizaOsActive: boolean
    scanVaultStatus: string
    mitigationStatus: string
  }
  onScanVault: () => void
  onViewReasoning: () => void
  onViewProof: () => void
  onManualTrigger: () => void
  currentReasoning: string
  currentRiskScore: number | null
  currentVolatilityStatus: "Stable" | "Volatile" | null
  currentMevRisk: "Low" | "High" | null // Translated
  dummyStableVaultData: {
    priceRange: string
    volumeChange: string
    slippageRisk: string
  }
  dummyVolatileVaultData: {
    priceRange: string
    volumeChange: string
    slippageRisk: string
  }
  aiModeOn: boolean
  setAiModeOn: (on: boolean) => void
}

export function StatusPanel({
  engineStatus,
  onScanVault,
  onViewReasoning,
  onViewProof,
  onManualTrigger,
  currentReasoning,
  currentRiskScore,
  currentVolatilityStatus,
  currentMevRisk,
  dummyStableVaultData,
  dummyVolatileVaultData,
  aiModeOn,
  setAiModeOn,
}: StatusPanelProps) {
  const getStatusIcon = (status: boolean | string) => {
    if (typeof status === "boolean") {
      return status ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />
    }
    switch (status) {
      case "Active":
      case "ON":
      case "Success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "idle":
      case "Idle":
        return <Clock className="h-5 w-5 text-gray-500" />
      case "checking":
        return <Repeat className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getRiskScoreColor = (score: number | null) => {
    if (score === null) return "text-foreground"
    if (score <= 30) return "text-green-600"
    if (score <= 70) return "text-amber-600"
    return "text-red-600"
  }

  const getVolatilityColor = (status: "Stable" | "Volatile" | null) => {
    if (status === null) return "text-foreground"
    return status === "Stable" ? "text-green-600" : "text-red-600"
  }

  const getMevRiskColor = (status: "Low" | "High" | null) => {
    if (status === null) return "text-foreground"
    return status === "Low" ? "text-green-600" : "text-red-600"
  }

  const currentDummyData = currentVolatilityStatus === "Stable" ? dummyStableVaultData : dummyVolatileVaultData

  return (
    <Card className="w-full bg-card border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center text-foreground">ENGINE & AI PROTECTION STATUS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* LIVE ENGINE STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border border-border p-4 rounded-lg bg-background/50">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-2 text-primary">Engine Status</h3>
            <div className="flex items-center gap-2">
              {getStatusIcon(engineStatus.guardianActive)}
              <span>
                <span className="font-medium">Guardian Active</span>: {/* Translated */}
                {engineStatus.guardianActive ? "✅ Active" : "❌ Inactive"} {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(engineStatus.elizaOsActive)}
              <span>
                <span className="font-medium">ElizaOS Agent</span>:{" "}
                {engineStatus.elizaOsActive ? "✅ Active" : "❌ Inactive"} {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(engineStatus.scanVaultStatus)}
              <span>
                <span className="font-medium">Vault Scan</span>: {engineStatus.scanVaultStatus} {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(engineStatus.mitigationStatus)}
              <span>
                <span className="font-medium">Mitigation</span>: {engineStatus.mitigationStatus} {/* Translated */}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-2 text-primary">Chainlink Modules</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(engineStatus.chainlinkModules).map(([moduleName, isActive]) => (
                <div key={moduleName} className="flex items-center gap-2">
                  {getStatusIcon(isActive)}
                  <span>
                    <span className="font-medium capitalize">{moduleName.replace(/([A-Z])/g, " $1")}</span>:{" "}
                    {isActive ? "✅" : "❌"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Scanner Output - Terminal-like box */}
        <div className="border border-border p-4 rounded-lg bg-muted/50 text-foreground text-sm space-y-2">
          <h3 className="font-semibold text-lg mb-2 text-foreground">RISK SCANNER OUTPUT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>
                <span className="font-medium">Guardian Active</span>: Automatic scan active {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span>
                <span className="font-medium">Risk Check</span>: Click for AI scan {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-primary" />
              <span>
                <span className="font-medium">Oracle Data</span>: Real-time price, health factor {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              <span>
                <span className="font-medium">Liquidation</span>: {engineStatus.liquidationStatus} {/* Translated */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>
                <span className="font-medium">Reasoning</span>: {engineStatus.aiReasoning}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Dna className="h-5 w-5 text-accent" />
              <span>
                <span className="font-medium">AI Scan Source</span>: {engineStatus.scanSource}
              </span>
            </div>
          </div>
        </div>

        {/* AI Mode Toggle */}
        <div className="flex items-center justify-center gap-2 p-2 bg-card border border-border rounded-lg shadow-md">
          <Label htmlFor="ai-mode" className="text-base font-medium text-foreground">
            AI Mode On (ElizaOS)
          </Label>
          <Switch
            id="ai-mode"
            checked={aiModeOn}
            onCheckedChange={setAiModeOn}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-border"
          />
        </div>

        {/* Action to Reason to Result Proof */}
        {currentReasoning && (
          <div className="mt-4 p-4 border border-primary rounded-lg bg-background/70 space-y-2 text-sm">
            <h3 className="font-semibold text-primary">🧠 AI REASONING & RESULT</h3> {/* Translated */}
            <p className="text-foreground">
              <span className="font-medium text-accent">AI Reason</span>: {currentReasoning} {/* Translated */}
            </p>
            {currentRiskScore !== null && (
              <p className="text-foreground">
                <span className="font-medium text-accent">Vault Risk Score</span>: {/* Translated */}
                <span className={getRiskScoreColor(currentRiskScore)}>
                  {currentRiskScore !== null ? `${new Intl.NumberFormat("en-US").format(currentRiskScore)}/100` : "N/A"}{" "}
                  ({currentRiskScore !== null ? (currentRiskScore <= 30 ? "Safe" : "Risky") : ""})
                </span>
              </p>
            )}
            {currentVolatilityStatus && (
              <p className="text-foreground">
                <span className="font-medium text-accent">Volatility Status</span>:{" "}
                <span className={getVolatilityColor(currentVolatilityStatus)}>{currentVolatilityStatus}</span>
              </p>
            )}
            {currentMevRisk && (
              <p className="text-foreground">
                <span className="font-medium text-accent">MEV Risk</span>:{" "}
                <span className={getMevRiskColor(currentMevRisk)}>{currentMevRisk}</span>
              </p>
            )}
            {currentVolatilityStatus && (
              <div className="mt-2 text-xs text-foreground/80">
                <h4 className="font-semibold text-primary">Simulated Chainlink Feeds Data:</h4> {/* Translated */}
                <p className="cyber-mono">Price Range (24h): {currentDummyData.priceRange}</p>
                <p className="cyber-mono">Volume Change: {currentDummyData.volumeChange}</p>
                <p className="cyber-mono">Slippage Risk: {currentDummyData.slippageRisk}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 uppercase"
            onClick={onScanVault}
          >
            Scan Vault
          </Button>
          <Button
            className="w-full bg-secondary text-secondary-foreground font-bold py-2 rounded-lg hover:bg-secondary/90 transition-colors duration-300 uppercase"
            onClick={onViewReasoning}
          >
            View Reasoning
          </Button>
          <Button
            className="w-full bg-border text-foreground font-bold py-2 rounded-lg shadow-md hover:bg-primary/20 hover:text-primary transition-colors duration-300 uppercase"
            onClick={onViewProof}
          >
            View Proof {/* Translated */}
          </Button>
          <Button
            className="w-full bg-border text-foreground font-bold py-2 rounded-lg shadow-md hover:bg-primary/20 hover:text-primary transition-colors duration-300 uppercase"
            onClick={onManualTrigger}
          >
            Manual Trigger
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
