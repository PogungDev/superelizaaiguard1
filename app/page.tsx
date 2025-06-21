"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { LandingPage } from "@/components/landing-page"
import { HowItWorksPage } from "@/components/how-it-works-page"
import { UserFriendlyDashboard } from "@/components/user-friendly-dashboard"
import { FeatureModulesPage } from "@/components/feature-modules-page"
import { dummyAuditLogs } from "@/lib/dummy-data"
import { simulateAction } from "@/lib/simulated-engine"
import { getElizaAIResponse } from "@/app/actions"

export default function HomePage() {
  return <VaultGuardApp />
}

type NoticeType = "success" | "warning" | "info" | "error"

function VaultGuardApp() {
  /* ───────────────────────── State ───────────────────────── */
  const [currentPage, setCurrentPage] = useState("landing")
  const [isConnected, setIsConnected] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [elizaStatus, setElizaStatus] = useState<"ACTIVE" | "SCANNING" | "IDLE">("IDLE")
  const [isDemo, setIsDemo] = useState(false)

  // Dashboard metrics
  const [vaultHealth, setVaultHealth] = useState(85)
  const [riskLevel, setRiskLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW")
  const [aiRecommendedAction, setAiRecommendedAction] = useState<string | null>(null)

  // State to pass system messages to Eliza OS
  const [elizaSystemActionMessage, setElizaSystemActionMessage] = useState<{
    message: string
    type: NoticeType
    reasoning: string
  } | null>(null)

  // Audit logs are now simple strings
  const [auditLogs, setAuditLogs] = useState<string[]>(
    dummyAuditLogs.map((log) => log.event + ": " + JSON.stringify(log.details)),
  )
  const [currentRiskScore, setCurrentRiskScore] = useState<number | null>(null)

  /* ──────────────────────── Helpers ──────────────────────── */
  // Auto-advance steps
  useEffect(() => {
    if (isConnected && currentStep === 1) {
      setCurrentStep(2)
      setElizaStatus("ACTIVE")
    } else if (currentRiskScore !== null && currentStep === 2) {
      setCurrentStep(3)
    }
  }, [isConnected, currentRiskScore, currentStep])

  // Clear AI recommendation after a new action or timeout
  useEffect(() => {
    if (aiRecommendedAction) {
      const timer = setTimeout(() => setAiRecommendedAction(null), 10000)
      return () => clearTimeout(timer)
    }
  }, [aiRecommendedAction])

  // Clear Eliza system message after it's processed (e.g., after a short delay)
  useEffect(() => {
    if (elizaSystemActionMessage) {
      const timer = setTimeout(() => setElizaSystemActionMessage(null), 100) // Clear quickly after Eliza processes it
      return () => clearTimeout(timer)
    }
  }, [elizaSystemActionMessage])

  // Centralized function to push logs
  const pushLog = (logContent: string) => {
    setAuditLogs((prev) => [...prev, logContent])
  }

  /* ───────────────────────── Actions ──────────────────────── */
  const handleConnectWallet = () => {
    setIsConnected(true)
    setElizaStatus("SCANNING")
    setIsDemo(false)
    setAiRecommendedAction(null)

    setTimeout(() => {
      setElizaStatus("ACTIVE")
      setElizaSystemActionMessage({
        message: "Wallet connected successfully! Your protection is now active.",
        type: "success",
        reasoning: "User initiated wallet connection.",
      })
    }, 2000)

    // Initial log for wallet connection
    pushLog("Wallet Connected: 0xAbC...123 on Ethereum")
  }

  const handleStartDemo = () => {
    setIsDemo(true)
    setCurrentPage("dashboard")
    setIsConnected(false)
    setCurrentStep(1)
    setVaultHealth(75)
    setRiskLevel("MEDIUM")
    setElizaStatus("ACTIVE")
    setAiRecommendedAction(null)
    setElizaSystemActionMessage({
      message: "Demo mode activated! Explore VaultGuard with simulated data.",
      type: "info",
      reasoning: "User initiated demo mode.",
    })
    pushLog("Demo Mode Activated")
  }

  const handleAction = async (actionType: string) => {
    setElizaStatus("SCANNING")
    setElizaSystemActionMessage({
      message: `Processing ${actionType}...`,
      type: "info",
      reasoning: "Action initiated.",
    })
    setAiRecommendedAction(null)

    try {
      const result = await simulateAction(actionType, true)

      // Update metrics based on results
      switch (actionType) {
        case "Connect Wallet":
          // This is handled by handleConnectWallet, which is called directly by UFD
          break

        case "Scan Vault":
          setCurrentRiskScore(result.additionalData?.riskScore ?? null)
          if (result.additionalData?.riskScore > 80) {
            setVaultHealth(35)
            setRiskLevel("HIGH")
            setAiRecommendedAction("Activate Anti-Liquidation")
          } else {
            setVaultHealth(92)
            setRiskLevel("LOW")
            setAiRecommendedAction("Optimize Yield")
          }
          break

        case "Activate Anti-Liquidation":
          setVaultHealth(Math.min(95, vaultHealth + 25))
          setRiskLevel("LOW")
          break

        case "Optimize Yield":
          // Metrics might be updated by simulateAction's visualUpdates
          break

        // New actions for modules
        case "Configure OracleBot":
        case "Configure MEV Protector":
        case "Configure Liquidation Guard":
        case "Configure Yield Switcher":
          setElizaSystemActionMessage({
            message: `Opening configuration for ${actionType.replace("Configure ", "")}...`,
            type: "info",
            reasoning: "User requested module configuration.",
          })
          break
        case "Test OracleBot":
          setElizaSystemActionMessage({
            message: `Simulating OracleBot action...`,
            type: "info",
            reasoning: "User initiated OracleBot test.",
          })
          break
        case "Test MEV Protector":
          setElizaSystemActionMessage({
            message: `Simulating MEV Protector action...`,
            type: "info",
            reasoning: "User initiated MEV Protector test.",
          })
          break
        case "Test Liquidation Guard":
          setElizaSystemActionMessage({
            message: `Simulating Liquidation Guard action...`,
            type: "info",
            reasoning: "User initiated Liquidation Guard test.",
          })
          break
        case "Test AutoYield Switcher":
          setElizaSystemActionMessage({
            message: `Simulating AutoYield Switcher action...`,
            type: "info",
            reasoning: "User initiated AutoYield Switcher test.",
          })
          break

        default:
          break
      }

      setElizaStatus("ACTIVE")
      setElizaSystemActionMessage({
        message: result.message,
        type: result.type,
        reasoning: result.reasoning || "Action completed successfully",
      })

      // No direct pushLog calls here for action results, UserFriendlyDashboard will handle it via onAddAuditLog
    } catch (err: any) {
      setElizaStatus("ACTIVE")
      setElizaSystemActionMessage({
        message: `Error: ${err.message}`,
        type: "error",
        reasoning: "Action failed due to an error.",
      })
    }
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    if (page === "dashboard" && !isConnected && !isDemo) {
      handleStartDemo()
    }
  }

  /* ───────────────────────── UI ──────────────────────────── */
  return (
    <div className="min-h-screen bg-vault-dark text-vault-text">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} isWalletConnected={isConnected} />

      {/* Removed Notification UI */}

      {/* Page Content */}
      <div className="py-8">
        {currentPage === "landing" && (
          <LandingPage
            onGetStarted={() => handlePageChange("dashboard")}
            onLearnMore={() => handlePageChange("how-it-works")}
          />
        )}
        {currentPage === "how-it-works" && <HowItWorksPage onTryDemo={() => handlePageChange("dashboard")} />}
        {currentPage === "dashboard" && (
          <UserFriendlyDashboard
            isConnected={isConnected}
            onConnectWallet={handleConnectWallet}
            onAction={handleAction}
            onAddAuditLog={pushLog} // Pass the centralized log function
            currentStep={currentStep}
            vaultHealth={vaultHealth}
            riskLevel={riskLevel}
            isDemo={isDemo}
            aiRecommendedAction={aiRecommendedAction}
            auditLogs={auditLogs} // Pass auditLogs
            elizaStatus={elizaStatus} // Pass elizaStatus
            onElizaStatusChange={setElizaStatus} // Pass onElizaStatusChange
            getElizaAIResponse={getElizaAIResponse} // Pass getElizaAIResponse
            systemActionMessage={elizaSystemActionMessage} // Pass system action messages to Eliza
          />
        )}
        {currentPage === "modules" && (
          <FeatureModulesPage isConnected={isConnected} onAction={handleAction} elizaStatus={elizaStatus} />
        )}
        {/* Removed ElizaCommandCenter as a separate page */}
      </div>
    </div>
  )
}
