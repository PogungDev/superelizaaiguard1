"use client"

import { useState } from "react"
import { getAgentStatusForAddress } from "@/lib/user-settings"

const DUMMY_WALLET_ADDRESS = "0xDummyWalletForUITesting1234567890abcdef"

export default function LiquidationGuardPage() {
  const [isEnabled, setIsEnabled] = useState(getAgentStatusForAddress("liquidationGuard", DUMMY_WALLET_ADDRESS))
  const address = DUMMY_WALLET_ADDRESS // Use dummy address for display
  const isConnected = true // Simulate connected for UI testing

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled)
    // TODO: Implement logic to save the state to user settings
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liquidation Guard</h1>

      <p className="text-yellow-600 font-semibold">Demo Mode: Using simulated wallet data.</p>
      <p>
        Simulated Wallet: <span className="font-mono text-blue-600">{address}</span>
      </p>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={isEnabled}
            onChange={toggleEnabled}
          />
          <span className="ml-2 text-gray-700">Enable Liquidation Guard</span>
        </label>
      </div>

      {isEnabled ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Active!</strong>
          <span className="block sm:inline"> Your assets are being monitored for potential liquidations.</span>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Inactive!</strong>
          <span className="block sm:inline"> Liquidation Guard is disabled. You may be at risk of liquidation.</span>
        </div>
      )}
    </div>
  )
}
