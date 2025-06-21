"use client"
interface ElizaResponseProps {
  result: string
}

export default function ElizaResponse({ result }: ElizaResponseProps) {
  let response = ""

  if (result.includes("Trigger action")) {
    response = "🤖 Eliza: I'm executing the protective action now."
  } else if (result.includes("Switch to")) {
    response = "🤖 Eliza: Switching strategy for better yield."
  } else if (result.includes("Liquidation")) {
    response = "🤖 Eliza: 🚨 Alert! Your vault is in danger!"
  } else if (result.includes("High MEV")) {
    response = "🤖 Eliza: Blocking dangerous TX. Wait for safe window."
  } else {
    response = "🤖 Eliza: Monitoring passively. No risk detected."
  }

  return <p className="mt-2 italic text-blue-600 font-medium">{response}</p>
}
