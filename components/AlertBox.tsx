"use client"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"

interface AlertLog {
  agent: string
  status: "CRITICAL" | "WARNING" | "SUCCESS" | "INFO"
  time: string
  message: string
}

interface AlertBoxProps {
  alerts: AlertLog[]
  onClearAlerts: () => void
  className?: string
}

export default function AlertBox({ alerts, onClearAlerts, className }: AlertBoxProps) {
  return (
    <Card className={`glass-card cyber-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-vault-primary cyber-text-glow flex items-center gap-2">
          <History className="h-6 w-6 text-neon-primary" /> ALERT LOG
        </CardTitle>
        {alerts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAlerts}
            className="border-vault-danger text-vault-danger hover:bg-vault-danger/10"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-primary scrollbar-track-vault-card">
        {alerts.length === 0 ? (
          <p className="text-vault-text-muted text-sm text-center py-4">No active alerts.</p>
        ) : (
          alerts.map((log, idx) => (
            <div
              key={idx}
              className={`text-sm p-3 rounded-md border ${
                log.status === "CRITICAL"
                  ? "bg-vault-danger/20 border-vault-danger"
                  : log.status === "WARNING"
                    ? "bg-neon-warning/20 border-neon-warning"
                    : log.status === "SUCCESS"
                      ? "bg-vault-success/20 border-vault-success"
                      : "bg-neon-primary/20 border-neon-primary"
              }`}
            >
              <div className="flex justify-between items-center">
                <strong className="font-medium text-vault-text">{log.agent}</strong>
                <Badge
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    log.status === "CRITICAL"
                      ? "bg-vault-danger text-white"
                      : log.status === "WARNING"
                        ? "bg-neon-warning text-white"
                        : log.status === "SUCCESS"
                          ? "bg-vault-success text-white"
                          : "bg-neon-primary text-white"
                  }`}
                >
                  {log.status}
                </Badge>
              </div>
              <div className="text-vault-text-muted text-xs mt-1">⏰ {new Date(log.time).toLocaleString()}</div>
              <div className="mt-1 text-vault-text">📌 {log.message}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
