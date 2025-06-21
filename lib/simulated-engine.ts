export async function simulateAction(
  action: string,
  isHackathonDemo = false,
): Promise<{
  message: string
  type: "success" | "warning" | "info" | "error"
  reasoning: string
  additionalData?: any
  visualUpdates?: {
    ltvChange?: number
    yieldChange?: number
    riskScoreChange?: number
    mevBlockedIncrease?: number
    alertsChange?: number
  }
  chainlinkServicesUsed?: string[]
}> {
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

  let message = ""
  let type: "success" | "warning" | "info" | "error" = "info"
  let reasoning = ""
  let additionalData: any = {}
  let visualUpdates: any = {}
  let chainlinkServicesUsed: string[] = []

  switch (action) {
    case "Connect Wallet":
      message = "🔗 Wallet connected! Chainlink Proof of Reserve verified $2.8M across 3 vaults."
      type = "success"
      reasoning = "Chainlink PoR confirmed collateral integrity. Data Feeds monitoring 15 price pairs."
      chainlinkServicesUsed = ["Proof of Reserves", "Data Feeds"]
      additionalData = {
        vaultsDetected: 3,
        totalValue: 2847392 + Math.floor(Math.random() * 500000),
        chainlinkServices: {
          dataFeeds: {
            active: 15,
            pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
            lastUpdate: Date.now(),
          },
          dataStreams: { active: 0, lowLatencyFeeds: 0 },
          vrf: { requests: 0, randomnessGenerated: 0 },
          proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
          automation: { upkeepContracts: 0, executionsToday: 0 },
          functions: { deployed: 0, computationsToday: 0 },
          ccip: { crossChainMessages: 0, supportedChains: 0 },
        },
        recommendation: "Scan Vault",
      }
      visualUpdates = { riskScoreChange: 0 }
      break

    case "Scan Vault":
      chainlinkServicesUsed = ["Data Feeds", "Data Streams", "Functions"]
      if (Math.random() < 0.4 && isHackathonDemo) {
        // High risk scenario
        message = "🚨 CRITICAL ALERT! Vault #73 (Aave ETH) at 87% LTV - Liquidation imminent!"
        type = "error"
        reasoning =
          "Data Feeds detected ETH price drop (-8.2%). Data Streams confirmed high volatility. Functions calculated liquidation risk at 95%."
        additionalData = {
          riskScore: 95,
          ltvRatio: 87.3,
          recommendation: "Activate Anti-Liquidation",
          chainlinkServices: {
            dataFeeds: {
              active: 15,
              pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
              lastUpdate: Date.now(),
              priceChanges: { "ETH/USD": -8.2, "BTC/USD": -3.1 },
            },
            dataStreams: { active: 3, lowLatencyFeeds: 3, volatilityDetected: true },
            functions: { deployed: 2, computationsToday: 47, lastCalculation: "Risk Analysis" },
            proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
            automation: { upkeepContracts: 0, executionsToday: 0 },
            vrf: { requests: 0, randomnessGenerated: 0 },
            ccip: { crossChainMessages: 0, supportedChains: 0 },
          },
          urgentAction: true,
        }
        visualUpdates = { ltvChange: 25, riskScoreChange: 75, alertsChange: 3 }
      } else if (Math.random() < 0.3) {
        // Moderate risk
        message = "⚠️ MODERATE RISK: Vault #45 shows elevated LTV (72%). Monitoring recommended."
        type = "warning"
        reasoning =
          "Data Feeds show stable prices. Functions identified yield optimization opportunities across 12 protocols."
        additionalData = {
          riskScore: 65,
          ltvRatio: 72.1,
          recommendation: "Optimize Yield",
          chainlinkServices: {
            dataFeeds: {
              active: 15,
              pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
              lastUpdate: Date.now(),
              priceChanges: { "ETH/USD": 1.2, "BTC/USD": 0.8 },
            },
            dataStreams: { active: 3, lowLatencyFeeds: 3, volatilityDetected: false },
            functions: { deployed: 2, computationsToday: 47, lastCalculation: "Yield Analysis" },
            proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
            automation: { upkeepContracts: 0, executionsToday: 0 },
            vrf: { requests: 0, randomnessGenerated: 0 },
            ccip: { crossChainMessages: 0, supportedChains: 0 },
          },
        }
        visualUpdates = { ltvChange: 10, riskScoreChange: 40, alertsChange: 1 }
      } else {
        // Healthy scenario
        message = "✅ ALL VAULTS HEALTHY! Average LTV: 45%. Excellent collateral management."
        type = "success"
        reasoning =
          "Data Feeds confirm stable market conditions. Functions analysis shows optimal positioning across all vaults."
        additionalData = {
          riskScore: 15,
          ltvRatio: 45.2,
          recommendation: "Optimize Yield",
          chainlinkServices: {
            dataFeeds: {
              active: 15,
              pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
              lastUpdate: Date.now(),
              priceChanges: { "ETH/USD": 2.1, "BTC/USD": 1.5 },
            },
            dataStreams: { active: 3, lowLatencyFeeds: 3, volatilityDetected: false },
            functions: { deployed: 2, computationsToday: 47, lastCalculation: "Health Check" },
            proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
            automation: { upkeepContracts: 0, executionsToday: 0 },
            vrf: { requests: 0, randomnessGenerated: 0 },
            ccip: { crossChainMessages: 0, supportedChains: 0 },
          },
        }
        visualUpdates = { ltvChange: -5, riskScoreChange: -10, alertsChange: -1 }
      }
      break

    case "Activate Anti-Liquidation":
      message = "🛡️ PROTECTION ACTIVATED! Chainlink Automation deployed with 12 upkeep contracts."
      type = "success"
      reasoning =
        "Automation Keepers now monitor LTV thresholds 24/7. Data Feeds trigger rebalancing at 75% LTV. Functions calculate optimal collateral additions."
      chainlinkServicesUsed = ["Automation", "Data Feeds", "Functions"]
      additionalData = {
        protectionLevel: "Maximum",
        chainlinkServices: {
          dataFeeds: {
            active: 15,
            pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
            lastUpdate: Date.now(),
          },
          dataStreams: { active: 3, lowLatencyFeeds: 3 },
          automation: {
            upkeepContracts: 12,
            executionsToday: 0,
            triggers: ["LTV > 75%", "Price Drop > 10%", "Volatility Spike"],
            nextCheck: Date.now() + 300000, // 5 minutes
          },
          functions: { deployed: 4, computationsToday: 47, lastCalculation: "Collateral Optimization" },
          proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
          vrf: { requests: 0, randomnessGenerated: 0 },
          ccip: { crossChainMessages: 0, supportedChains: 0 },
        },
        recommendation: "Optimize Yield",
      }
      visualUpdates = { ltvChange: -20, riskScoreChange: -50, alertsChange: -3 }
      break

    case "Optimize Yield":
      const yieldBoost = 15 + Math.random() * 10
      message = `💰 YIELD OPTIMIZED! ${yieldBoost.toFixed(1)}% APY increase via Chainlink Functions analysis.`
      type = "success"
      reasoning = `Functions analyzed 47 DeFi protocols via external APIs. Data Feeds confirmed optimal entry prices. Recommended strategy: Convex stETH (6.8% → ${(6.8 + yieldBoost).toFixed(1)}% APY).`
      chainlinkServicesUsed = ["Functions", "Data Feeds"]
      additionalData = {
        yieldIncrease: yieldBoost / 100,
        chainlinkServices: {
          dataFeeds: {
            active: 15,
            pairs: ["ETH/USD", "BTC/USD", "USDC/USD", "DAI/USD", "USDT/USD"],
            lastUpdate: Date.now(),
          },
          dataStreams: { active: 3, lowLatencyFeeds: 3 },
          functions: {
            deployed: 6,
            computationsToday: 94,
            lastCalculation: "Yield Strategy Optimization",
            protocolsAnalyzed: 47,
            apiCalls: 156,
          },
          automation: { upkeepContracts: 12, executionsToday: 0 },
          proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
          vrf: { requests: 0, randomnessGenerated: 0 },
          ccip: { crossChainMessages: 0, supportedChains: 0 },
        },
        recommendation: "Test Security",
      }
      visualUpdates = { yieldChange: yieldBoost, riskScoreChange: -5 }
      break

    case "Simulate Attack":
      chainlinkServicesUsed = ["VRF", "Functions", "Data Streams"]
      if (Math.random() < 0.3 && isHackathonDemo) {
        message = "⚠️ VULNERABILITY DETECTED! Flash loan vector identified during VRF stress test."
        type = "warning"
        reasoning =
          "VRF generated 1,000 random attack scenarios. Functions computed defense strategies. Data Streams detected potential MEV exploitation window of 12ms."
        additionalData = {
          attackBlockedStatus: "Partial Success",
          chainlinkServices: {
            dataFeeds: { active: 15, lastUpdate: Date.now() },
            dataStreams: {
              active: 5,
              lowLatencyFeeds: 5,
              mevDetectionActive: true,
              exploitationWindow: "12ms",
            },
            vrf: {
              requests: 1000,
              randomnessGenerated: 1000,
              attackScenariosGenerated: 1000,
              lastRequest: Date.now(),
            },
            functions: {
              deployed: 8,
              computationsToday: 1247,
              lastCalculation: "Security Analysis",
              defenseStrategiesComputed: 156,
            },
            automation: { upkeepContracts: 12, executionsToday: 0 },
            proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
            ccip: { crossChainMessages: 0, supportedChains: 0 },
          },
          recommendation: "Scan Vault",
        }
        visualUpdates = { mevBlockedIncrease: 5, riskScoreChange: 10 }
      } else {
        message = "🔥 ATTACK SIMULATION SUCCESS! All vectors defended. Vault resilience: 98.7%"
        type = "success"
        reasoning =
          "VRF generated 2,500 random attack scenarios including flash loans, MEV, and reentrancy. Functions computed defense success rate at 98.7%. Data Streams confirmed no exploitable windows."
        additionalData = {
          attackBlockedStatus: "Complete Success",
          chainlinkServices: {
            dataFeeds: { active: 15, lastUpdate: Date.now() },
            dataStreams: {
              active: 5,
              lowLatencyFeeds: 5,
              mevDetectionActive: true,
              exploitationWindow: "0ms",
            },
            vrf: {
              requests: 2500,
              randomnessGenerated: 2500,
              attackScenariosGenerated: 2500,
              lastRequest: Date.now(),
            },
            functions: {
              deployed: 8,
              computationsToday: 2847,
              lastCalculation: "Comprehensive Security Analysis",
              defenseStrategiesComputed: 387,
              successRate: 98.7,
            },
            automation: { upkeepContracts: 12, executionsToday: 0 },
            proofOfReserve: { verified: true, totalCollateral: 2847392, lastCheck: Date.now() },
            ccip: { crossChainMessages: 0, supportedChains: 0 },
          },
          recommendation: null,
        }
        visualUpdates = { mevBlockedIncrease: 15, riskScoreChange: -10 }
      }
      break

    default:
      message = `Action "${action}" processed.`
      type = "info"
      reasoning = "Generic simulation response."
      chainlinkServicesUsed = []
      break
  }

  return { message, type, reasoning, additionalData, visualUpdates, chainlinkServicesUsed }
}

// Enhanced proactive system with specific Chainlink service triggers
export async function triggerProactiveAlert(currentRiskScore: number, currentLTV: number) {
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000))

  if (currentRiskScore > 80 || currentLTV > 85) {
    return {
      message: "🚨 CHAINLINK AUTOMATION ALERT: Critical threshold breached! Auto-protection recommended.",
      type: "error" as const,
      reasoning:
        "Data Feeds detected price volatility. Automation Keepers ready to deploy. Functions calculated 94% liquidation probability.",
      autoAction: "Activate Anti-Liquidation",
      urgency: "critical",
      chainlinkServicesTriggered: ["Data Feeds", "Automation", "Functions"],
    }
  } else if (currentRiskScore > 60 || currentLTV > 70) {
    return {
      message: "⚠️ CHAINLINK FUNCTIONS ALERT: Elevated risk detected. Yield optimization recommended.",
      type: "warning" as const,
      reasoning:
        "Functions identified 23% yield improvement opportunity. Data Feeds confirm stable market conditions for strategy switch.",
      autoAction: "Optimize Yield",
      urgency: "moderate",
      chainlinkServicesTriggered: ["Functions", "Data Feeds"],
    }
  }

  return null
}
