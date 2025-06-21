"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Eye, Activity } from "lucide-react"

interface CyberDashboardProps {
  isConnected: boolean
  currentStep: number
  vaultHealth: number
  mevThreatLevel: "LOW" | "MEDIUM" | "HIGH"
  yieldOpportunity: number
  elizaStatus: "ACTIVE" | "SCANNING" | "IDLE"
}

export function CyberDashboard({
  isConnected,
  currentStep,
  vaultHealth,
  mevThreatLevel,
  yieldOpportunity,
  elizaStatus,
}: CyberDashboardProps) {
  const [scanAnimation, setScanAnimation] = useState(false)
  const [binaryStream, setBinaryStream] = useState("")

  // Generate binary stream effect
  useEffect(() => {
    const interval = setInterval(() => {
      const binary = Array.from({ length: 50 }, () => (Math.random() > 0.5 ? "1" : "0")).join("")
      setBinaryStream(binary)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500"
    if (health >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-500"
      case "MEDIUM":
        return "text-yellow-500"
      case "HIGH":
        return "text-red-500"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="relative min-h-screen bg-vault-dark overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>
        <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse"></div>
        <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-transparent via-accent to-transparent animate-pulse"></div>
      </div>

      {/* Binary Stream Background */}
      <div className="absolute inset-0 opacity-5 font-mono text-xs text-primary overflow-hidden">
        <div className="whitespace-nowrap animate-scroll-left">{binaryStream.repeat(20)}</div>
      </div>

      {/* Grid Layout */}
      <div className="relative z-10 grid grid-cols-12 gap-4 p-6 h-screen">
        {/* ElizaOS Core - Top Left */}
        <Card className="col-span-12 md:col-span-4 bg-card/80 border border-border">
          <div className="p-6 text-center">
            <div
              className={`relative mx-auto w-20 h-20 rounded-full border-4 mb-4 ${
                elizaStatus === "ACTIVE"
                  ? "border-green-500 animate-pulse"
                  : elizaStatus === "SCANNING"
                    ? "border-yellow-500 animate-spin"
                    : "border-border"
              }`}
            >
              <div
                className={`absolute inset-2 rounded-full ${
                  elizaStatus === "ACTIVE"
                    ? "bg-green-500/20"
                    : elizaStatus === "SCANNING"
                      ? "bg-yellow-500/20"
                      : "bg-border/20"
                }`}
              >
                <Eye className="w-full h-full p-4 text-primary" />
              </div>
              {elizaStatus === "SCANNING" && (
                <div className="absolute inset-0 border-t-4 border-yellow-500 rounded-full animate-spin"></div>
              )}
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">ELIZA CORE</h3>
            <p
              className={`text-sm font-mono ${
                elizaStatus === "ACTIVE"
                  ? "text-green-500"
                  : elizaStatus === "SCANNING"
                    ? "text-yellow-500"
                    : "text-foreground"
              }`}
            >
              STATUS: {elizaStatus}
            </p>
          </div>
        </Card>

        {/* Vault Health Monitor - Top Center */}
        <Card className="col-span-12 md:col-span-4 bg-card/80 border border-border">
          <div className="p-6 text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-border"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - vaultHealth / 100)}`}
                  className={`${getHealthColor(vaultHealth)} transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getHealthColor(vaultHealth)}`}>{vaultHealth}%</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">VAULT HEALTH</h3>
            <p className="text-sm text-foreground">Security Index</p>
          </div>
        </Card>

        {/* MEV Threat Matrix - Top Right */}
        <Card className="col-span-12 md:col-span-4 bg-card/80 border border-border">
          <div className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">MEV THREAT MATRIX</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded border-2 ${
                    mevThreatLevel === "HIGH" && [2, 4, 6].includes(i)
                      ? "border-red-500 bg-red-500/20 animate-pulse"
                      : mevThreatLevel === "MEDIUM" && [4].includes(i)
                        ? "border-yellow-500 bg-yellow-500/20"
                        : "border-border bg-border/20"
                  }`}
                />
              ))}
            </div>
            <div className="text-center">
              <span className={`text-lg font-bold ${getThreatColor(mevThreatLevel)}`}>{mevThreatLevel} RISK</span>
            </div>
          </div>
        </Card>

        {/* Command Console - Middle */}
        <Card className="col-span-12 bg-card/80 border border-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-primary">COMMAND CONSOLE</h3>
            </div>
            <div className="bg-background/70 rounded p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <span className="animate-pulse">▶</span>
                <span>ElizaOS: System initialized and monitoring...</span>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span>▶</span>
                  <span>ElizaOS: Wallet connection verified - 0xAbC...123</span>
                </div>
              )}
              {currentStep >= 2 && (
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <span className="animate-pulse">▶</span>
                  <span>ElizaOS: Vault scan in progress... analyzing risk factors</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-foreground/70">
                <span>▶</span>
                <span>Awaiting user input...</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Oracle Data Stream - Bottom Left */}
        <Card className="col-span-12 md:col-span-6 bg-card/80 border border-border">
          <div className="p-4">
            <h3 className="text-lg font-bold text-primary mb-3">ORACLE DATA STREAM</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-foreground">ETH/USD:</span>
                <span className="text-green-500">$2,847.32 ↗</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Volume 24h:</span>
                <span className="text-primary">$1.2B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Slippage:</span>
                <span className={mevThreatLevel === "HIGH" ? "text-red-500" : "text-green-500"}>
                  {mevThreatLevel === "HIGH" ? "0.8%" : "0.2%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Gas Price:</span>
                <span className="text-primary">23 gwei</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Yield Strategy - Bottom Right */}
        <Card className="col-span-12 md:col-span-6 bg-card/80 border border-border">
          <div className="p-4">
            <h3 className="text-lg font-bold text-primary mb-3">YIELD OPTIMIZATION</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Current APY:</span>
                <span className="text-primary">5.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Optimal APY:</span>
                <span className="text-green-500">12.8%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${yieldOpportunity}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-green-500 font-bold">+{yieldOpportunity}% Opportunity</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Scanning Animation Overlay */}
      {scanAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan-horizontal"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-accent animate-scan-vertical"></div>
        </div>
      )}
    </div>
  )
}
