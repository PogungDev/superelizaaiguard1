"use client"

import { useState } from "react"
import { getAgentStatusForAddress } from "@/lib/user-settings"

const DUMMY_WALLET_ADDRESS = "0xDummyWalletForUITesting1234567890abcdef"

export default function Home() {
  const [isEnabled, setIsEnabled] = useState(getAgentStatusForAddress("mevProtector", DUMMY_WALLET_ADDRESS))
  const address = DUMMY_WALLET_ADDRESS // Use dummy address for display
  const isConnected = true // Simulate connected for UI testing

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled)
    // In a real implementation, you would also update the user's settings in local storage or a database.
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">MEV Protector Settings</h1>

      <div className="mt-4">
        <p className="text-yellow-600 font-semibold">Demo Mode: Using simulated wallet data.</p>
        <p>
          Simulated Wallet: <span className="font-mono text-blue-600">{address}</span>
        </p>
      </div>

      <div className="mt-8">
        <label className="inline-flex items-center">
          <span className="mr-2">MEV Protection Enabled:</span>
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
            checked={isEnabled}
            onChange={toggleEnabled}
          />
        </label>
      </div>

      <div className="mt-8">
        <p>
          Status:{" "}
          <span className={isEnabled ? "text-green-500" : "text-red-500"}>{isEnabled ? "Enabled" : "Disabled"}</span>
        </p>
      </div>
    </div>
  )
}
