"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShieldOff, History, Award, Zap } from "lucide-react"

interface ActionPanelProps {
  onSimulateAttack: () => void
  onOptimizeYield: () => void
  onActivateAntiLiquidation: () => void
  onMintBadge: () => void
  onViewHistory: () => void
  isBadgeMinted: boolean
}

export function ActionPanel({
  onSimulateAttack,
  onOptimizeYield,
  onActivateAntiLiquidation,
  onMintBadge,
  onViewHistory,
  isBadgeMinted,
}: ActionPanelProps) {
  return (
    <Card className="w-full shadow-lg bg-card border border-vault-border shadow-neon-glow">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center text-neon-primary">
          ACTION PANEL: USER CHOOSES WHAT TO DO {/* Translated */}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          className="w-full bg-neon-warning text-vault-dark font-bold py-3 rounded-lg shadow-neon-glow hover:bg-neon-warning/80 transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase"
          onClick={onSimulateAttack}
        >
          <Zap className="h-5 w-5" /> SIMULATE ATTACK
        </Button>
        <Button
          className="w-full bg-neon-accent text-vault-dark font-bold py-3 rounded-lg shadow-neon-glow hover:bg-neon-accent/80 transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase"
          onClick={onOptimizeYield}
        >
          <TrendingUp className="h-5 w-5" /> GET YIELD RECOMMENDATION {/* Translated */}
        </Button>
        <Button
          className="w-full bg-neon-primary text-vault-dark font-bold py-3 rounded-lg shadow-neon-glow hover:bg-neon-primary/80 transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase"
          onClick={onActivateAntiLiquidation}
        >
          <ShieldOff className="h-5 w-5" /> ACTIVATE ANTI-LIQUIDATION {/* Translated */}
        </Button>
        <Button
          className="w-full bg-neon-primary text-vault-dark font-bold py-3 rounded-lg shadow-neon-glow hover:bg-neon-primary/80 transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase"
          onClick={onMintBadge}
          disabled={isBadgeMinted}
        >
          <Award className="h-5 w-5" /> {isBadgeMinted ? "BADGE OWNED!" : "MINT WALLET SECURITY BADGE"}{" "}
          {/* Translated */}
        </Button>
        <Button
          className="w-full bg-vault-border hover:bg-vault-border/80 text-vault-text font-bold py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2 md:col-span-2 text-lg uppercase"
          onClick={onViewHistory}
        >
          <History className="h-5 w-5" /> VIEW HISTORY {/* Translated */}
        </Button>
        {isBadgeMinted && (
          <div className="md:col-span-2 text-center text-sm text-neon-accent font-medium mt-2 shadow-neon-text">
            🏅 Wallet Verified by VaultGuard! Tx Hash: 0xDummyTxHash123...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
