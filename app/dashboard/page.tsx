import { EnhancedDashboard } from "@/components/enhanced-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">VaultGuard Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your DeFi positions and AI-powered protection systems
        </p>
      </div>
      <EnhancedDashboard />
    </div>
  )
}
