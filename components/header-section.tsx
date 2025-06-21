"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ShieldCheck } from "lucide-react"

interface HeaderSectionProps {
  isConnected: boolean
  activeChain: string
  walletAddress: string
  onConnectWallet: () => void
  onScanSecurity: () => void
}

export function HeaderSection({
  isConnected,
  activeChain,
  walletAddress,
  onConnectWallet,
  onScanSecurity,
}: HeaderSectionProps) {
  return (
    <Card className="w-full shadow-lg bg-card border border-vault-border shadow-neon-glow">
      <CardHeader className="pb-4">
        <CardTitle className="text-4xl font-bold text-center text-neon-primary text-neon-glow uppercase">
          <span className="animate-scan-light">VaultGuard</span>
        </CardTitle>
        <h2 className="text-xl font-semibold text-center text-vault-text mt-2">
          🔒 Scan Vault Now — ZeroMEV Guardian AI Active
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-neon-warning/20 text-neon-warning border border-neon-warning p-3 rounded-lg text-sm text-center font-medium shadow-md">
          ⚠️ $900M lost annually due to MEV & liquidations. Protect now! {/* Translated */}
        </div>
        {!isConnected ? (
          <Button
            className="w-full bg-neon-primary text-vault-dark font-bold py-4 rounded-lg shadow-neon-glow hover:bg-neon-accent transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase"
            onClick={onConnectWallet}
          >
            <Wallet className="h-6 w-6" /> CONNECT NOW
          </Button>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 border border-neon-accent rounded-lg bg-card/50 shadow-md">
            <div className="flex items-center gap-2 text-base font-medium text-neon-accent">
              <Wallet className="h-5 w-5 text-neon-accent" />
              <span>
                Connected: {walletAddress} ({activeChain})
              </span>
            </div>
            <Button
              className="w-full md:w-auto bg-neon-accent text-vault-dark font-bold py-2 px-4 rounded-lg shadow-md hover:bg-neon-primary transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase"
              onClick={onScanSecurity}
            >
              <ShieldCheck className="h-4 w-4" /> Scan Security {/* Translated */}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
