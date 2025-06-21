"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EnhancedDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VaultGuard System Status</CardTitle>
          <CardDescription>System overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Dashboard content goes here</p>
        </CardContent>
      </Card>
    </div>
  )
} 