import userAgentSettings from "@/data/userAgentSettings.json"

const DUMMY_WALLET_ADDRESS = "0xDummyWalletForUITesting1234567890abcdef"

type AgentKey = "oracleBot" | "mevProtector" | "liquidationGuard" | "yieldSwitcher"

interface UserAgentSettingsData {
  [walletAddress: string]: {
    oracleBot: boolean
    mevProtector: boolean
    liquidationGuard: boolean
    yieldSwitcher: boolean
  }
}

// Function to get status for a specific agent for a given wallet address
export function getAgentStatusForAddress(agentKey: AgentKey, walletAddress: string = DUMMY_WALLET_ADDRESS): boolean {
  const settings = (userAgentSettings as UserAgentSettingsData)[walletAddress.toLowerCase()]
  return settings ? settings[agentKey] : false // Default to false if address not found
}

// Function to get all agent statuses for a given wallet address
export function getAllAgentStatusesForAddress(walletAddress: string = DUMMY_WALLET_ADDRESS): {
  [key in AgentKey]: boolean
} {
  const settings = (userAgentSettings as UserAgentSettingsData)[walletAddress.toLowerCase()]
  // Provide default false for all agents if address not found
  return (
    settings || {
      oracleBot: false,
      mevProtector: false,
      liquidationGuard: false,
      yieldSwitcher: false,
    }
  )
}
