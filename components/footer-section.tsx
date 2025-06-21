"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { List, RotateCcw, LogOut } from "lucide-react"

interface FooterSectionProps {
  onViewAllLogs: () => void
  onResetAll: () => void
  onDisconnectWallet: () => void
}

export function FooterSection({ onViewAllLogs, onResetAll, onDisconnectWallet }: FooterSectionProps) {
  return (
    <Card className="w-full shadow-lg bg-card border border-vault-border shadow-neon-glow">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          className="w-full bg-vault-border hover:bg-vault-border/80 text-vault-text font-bold py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2 uppercase"
          onClick={onViewAllLogs}
        >
          <List className="h-5 w-5 text-neon-primary" /> View All Logs {/* Translated */}
        </Button>
        <Button
          className="w-full bg-neon-warning/50 hover:bg-neon-warning/70 text-vault-dark font-bold py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2 uppercase"
          onClick={onResetAll}
        >
          <RotateCcw className="h-5 w-5 text-vault-dark" /> Reset All {/* Translated */}
        </Button>
        <Button
          className="w-full bg-vault-border hover:bg-vault-border/80 text-vault-text font-bold py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2 uppercase"
          onClick={onDisconnectWallet}
        >
          <LogOut className="h-5 w-5 text-neon-primary" /> Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
