"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

const LiveStatusFeed = () => {
  const [feedMessages] = useState<string[]>([
    "⛓ Vault #298 Clean",
    "⚡ MEV Scan: Initiated",
    "📊 Oracle Data: Syncing",
    "🛡 Guardian: Online",
    "🧠 AI Agent: Active",
    "💰 Liquidation Risk: Low",
    "📈 Yield Optimization: Running",
    "✅ Wallet Security: Verified",
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedMessages.length)
    }, 3000) // Change message every 3 seconds

    return () => clearInterval(interval)
  }, [feedMessages.length])

  return (
    <Card className="w-full p-4 bg-card border border-neon-primary shadow-neon-glow text-neon-primary text-lg font-bold text-center overflow-hidden relative">
      <div className="h-8 flex items-center justify-center">
        <span className="animate-ping-pong">{feedMessages[currentIndex]}</span>
      </div>
      <style jsx>{`
        @keyframes ping-pong {
          0%, 100% {
            transform: translateX(0);
            opacity: 1;
          }
          49% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(100%); /* Move out to right */
            opacity: 0;
          }
          51% {
            transform: translateX(-100%); /* Move in from left */
            opacity: 0;
          }
          52% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-ping-pong {
          animation: ping-pong 3s infinite;
        }
      `}</style>
    </Card>
  )
}

export default LiveStatusFeed
