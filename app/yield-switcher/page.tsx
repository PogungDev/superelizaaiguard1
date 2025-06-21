"use client"

import { useState } from "react"
import { getAgentStatusForAddress } from "@/lib/user-settings"

const DUMMY_WALLET_ADDRESS = "0xDummyWalletForUITesting1234567890abcdef"

export default function YieldSwitcherPage() {
  const [isEnabled, setIsEnabled] = useState(getAgentStatusForAddress("yieldSwitcher", DUMMY_WALLET_ADDRESS))
  const address = DUMMY_WALLET_ADDRESS // Use dummy address for display
  const isConnected = true // Simulate connected for UI testing

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled)
    // In a real application, you would also update the user's settings in the database or local storage.
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Yield Switcher Settings</h1>

      <p className="text-yellow-600 font-semibold">Demo Mode: Using simulated wallet data.</p>
      <p>
        Simulated Wallet: <span className="font-mono text-blue-600">{address}</span>
      </p>

      <div className="flex items-center space-x-4 mt-4">
        <label htmlFor="yield-switcher" className="font-medium">
          Yield Switcher:
        </label>
        <button
          id="yield-switcher"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isEnabled ? "bg-green-500" : "bg-gray-200"
          }`}
          role="switch"
          aria-checked={isEnabled}
          onClick={toggleEnabled}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ring-0 ring-gray-200 ring-offset-2 ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <p className="mt-4">
        Status:{" "}
        <span className={isEnabled ? "text-green-500 font-semibold" : "text-gray-500 font-semibold"}>
          {isEnabled ? "Enabled" : "Disabled"}
        </span>
      </p>
    </div>
  )
}
