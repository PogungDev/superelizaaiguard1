"use client"

import { useState } from "react"
import { getAgentStatusForAddress } from "@/lib/user-settings"

const DUMMY_WALLET_ADDRESS = "0xDummyWalletForUITesting1234567890abcdef"

export default function OracleBotPage() {
  const [isEnabled, setIsEnabled] = useState(getAgentStatusForAddress("oracleBot", DUMMY_WALLET_ADDRESS))
  const address = DUMMY_WALLET_ADDRESS // Use dummy address for display
  const isConnected = true // Simulate connected for UI testing

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled)
    // In a real application, you would also update the user's settings in a database or other persistent storage.
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Oracle Bot Settings</h1>

      <p className="text-yellow-600 font-semibold">Demo Mode: Using simulated wallet data.</p>
      <p>
        Simulated Wallet: <span className="font-mono text-blue-600">{address}</span>
      </p>

      <div className="mt-4">
        <label className="inline-flex items-center">
          <span className="mr-2">Oracle Bot Enabled:</span>
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
            checked={isEnabled}
            onChange={toggleEnabled}
          />
        </label>
      </div>

      {isEnabled ? (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h2 className="text-lg font-semibold">Oracle Bot is Active</h2>
          <p>The Oracle Bot is currently running and providing data feeds.</p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <h2 className="text-lg font-semibold">Oracle Bot is Inactive</h2>
          <p>The Oracle Bot is currently disabled.</p>
        </div>
      )}
    </div>
  )
}
