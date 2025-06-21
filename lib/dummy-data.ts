export const dummyAiResponses: { [key: string]: string } = {
  hello: "Greetings, user. How may I assist you with your DeFi security today?",
  "how are you?": "I am an AI, functioning optimally. My primary directive is to ensure your vault's security.",
  "what is vaultguard?":
    "VaultGuard is an AI-powered DeFi protection system that uses Chainlink oracles to safeguard your investments from MEV attacks, prevent liquidations, and optimize yields.",
  "scan my vault":
    "Initiating a comprehensive scan of your DeFi positions for potential risks and opportunities. This may take a moment.",
  "check security": "Performing a real-time security audit on your connected wallet and active vault positions.",
  "what are the risks?":
    "Common risks include MEV (Maximal Extractable Value) attacks, liquidation threats due to market volatility, and suboptimal yield farming strategies. VaultGuard mitigates these.",
  "activate protection":
    "Activating advanced anti-liquidation protocols. Your positions will now be actively monitored and protected against sudden market downturns.",
  "optimize yield":
    "Analyzing current market conditions and your portfolio to identify the most profitable yield farming opportunities across integrated protocols.",
  "simulate attack":
    "Initiating a simulated MEV attack on your vault to test its resilience. This is a diagnostic process and will not affect your actual funds.",
  "which vault is most optimal?":
    "Based on current Chainlink data and market analysis, Vault #42 offers the highest risk-adjusted yield potential at 12.8% APY. Consider rebalancing for optimal returns.",
  "why is vault a risky?":
    "Vault #73 is currently exhibiting high volatility due to recent oracle price fluctuations and increased MEV activity in its underlying liquidity pools. Immediate action is recommended.",
  "tell me about chainlink":
    "Chainlink is a decentralized oracle network that provides reliable, tamper-proof inputs and outputs for smart contracts, enabling VaultGuard's real-time data analysis and automated actions.",
  "what is mev?":
    "MEV, or Maximal Extractable Value, refers to the profit that miners or validators can extract by reordering, censoring, or inserting transactions within a block. VaultGuard protects you from such exploitations.",
  "how to disconnect?":
    "To disconnect your wallet, navigate to the 'Settings' or 'Profile' section in your dashboard and look for the 'Disconnect Wallet' option. Confirm your choice to end the session.",
  "thank you":
    "You are welcome. My purpose is to serve your security needs. Is there anything else I can assist you with?",
  goodbye: "Farewell. Remember, ElizaOS is always vigilant, protecting your DeFi journey. Come back anytime.",
}

export const dummyAuditLogs = [
  {
    timestamp: "2025-06-18 09:00:00",
    event: "SystemInitialized",
    details: { message: "ElizaOS Core online. All modules loaded." },
  },
]
