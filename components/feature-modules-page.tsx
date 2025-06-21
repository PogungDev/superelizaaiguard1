"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Settings,
  Brain,
  Clock,
  CheckCircle,
  Loader2,
  Play,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch" // Added Switch

interface FeatureModulesPageProps {
  isConnected: boolean
  onAction: (action: string) => void
  elizaStatus: "ACTIVE" | "SCANNING" | "IDLE"
}

export function FeatureModulesPage({ isConnected, onAction, elizaStatus }: FeatureModulesPageProps) {
  const [activeTab, setActiveTab] = useState("oracle-action")
  // Local states for module toggles
  const [oracleBotEnabled, setOracleBotEnabled] = useState(true)
  const [mevProtectorEnabled, setMevProtectorEnabled] = useState(true)
  const [liquidationGuardEnabled, setLiquidationGuardEnabled] = useState(false) // Default disabled for demo
  const [autoYieldSwitcherEnabled, setAutoYieldSwitcherEnabled] = useState(true)

  const getElizaStatusBadge = () => {
    switch (elizaStatus) {
      case "ACTIVE":
        return (
          <Badge className="status-active">
            <Activity className="h-3 w-3 mr-1" />
            ACTIVE
          </Badge>
        )
      case "SCANNING":
        return (
          <Badge className="status-warning">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            SCANNING
          </Badge>
        )
      case "IDLE":
        return (
          <Badge className="status-info">
            <Clock className="h-3 w-3 mr-1" />
            IDLE
          </Badge>
        )
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Card className="glass-card border-vault-primary shadow-vault-glow flex flex-col text-vault-text min-h-[calc(100svh-80px)]">
        <CardHeader className="pb-4 border-b-2 border-vault-primary bg-vault-card/30">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-vault-primary/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-vault-primary" />
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    elizaStatus === "ACTIVE"
                      ? "bg-vault-success animate-pulse"
                      : elizaStatus === "SCANNING"
                        ? "bg-vault-warning animate-ping"
                        : "bg-vault-border"
                  }`}
                ></div>
              </div>
              <div>
                <div className="text-lg font-bold text-vault-text">VAULTGUARD MODULES</div>
                <div className="text-sm text-vault-text-muted">Advanced Protection & Optimization Engines</div>
              </div>
            </div>
            <div className="flex items-center gap-2">{getElizaStatusBadge()}</div>
          </CardTitle>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4 bg-vault-card/50">
              <TabsTrigger
                value="oracle-action"
                className="data-[state=active]:bg-vault-primary data-[state=active]:text-white"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                OracleBot
              </TabsTrigger>
              <TabsTrigger
                value="mev-protector"
                className="data-[state=active]:bg-vault-primary data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4 mr-1" />
                MEV Protector
              </TabsTrigger>
              <TabsTrigger
                value="liquidation-guard"
                className="data-[state=active]:bg-vault-primary data-[state=active]:text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Liquidation Guard
              </TabsTrigger>
              <TabsTrigger
                value="yield-switcher"
                className="data-[state=active]:bg-vault-primary data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                AutoYield Switcher
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <Tabs value={activeTab} className="flex-1 flex flex-col">
          {/* Oracle Action Engine Tab */}
          <TabsContent value="oracle-action" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-6 scrollbar-thin scrollbar-thumb-vault-primary scrollbar-track-transparent">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-vault-primary" /> OracleBot: Automated Actions
              </h3>
              <p className="text-vault-text-muted mb-6">
                Automate actions based on real-time oracle data. Your bot monitors critical data feeds and executes
                pre-defined strategies without manual intervention.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Settings className="h-5 w-5 text-vault-success" /> Automation Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">OracleBot Status</span>
                      <Switch
                        checked={oracleBotEnabled}
                        onCheckedChange={setOracleBotEnabled}
                        disabled={!isConnected}
                        aria-label="Toggle OracleBot"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">Price Feed Monitoring</span>
                      <Badge className={oracleBotEnabled ? "status-active" : "status-info"}>
                        {oracleBotEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-vault-text-muted">Last Automated Action</span>
                      <span className="text-vault-text">2 mins ago</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Eye className="h-5 w-5 text-vault-warning" /> Current Data Feeds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">ETH/USD Price</span>
                        <span className="text-vault-text">$3,500.23</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">BTC/USD Price</span>
                        <span className="text-vault-text">$70,123.45</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Gas Price (Gwei)</span>
                        <span className="text-vault-text">25</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => onAction("Configure OracleBot")}
                  disabled={!isConnected}
                  className="btn-primary flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" /> Configure Rules
                </Button>
                <Button
                  onClick={() => onAction("Test OracleBot")}
                  disabled={!isConnected || !oracleBotEnabled}
                  className="btn-secondary flex-1"
                >
                  <Play className="h-4 w-4 mr-2" /> Test OracleBot
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* MEV Protector Tab */}
          <TabsContent value="mev-protector" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-6 scrollbar-thin scrollbar-thumb-vault-primary scrollbar-track-transparent">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-vault-success" /> MEV Protector: Anti-Frontrunning
              </h3>
              <p className="text-vault-text-muted mb-6">
                Protect your transactions from malicious MEV (Maximal Extractable Value) attacks like front-running and
                sandwich attacks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-vault-success" /> Protection Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">MEV Protector Status</span>
                      <Switch
                        checked={mevProtectorEnabled}
                        onCheckedChange={setMevProtectorEnabled}
                        disabled={!isConnected}
                        aria-label="Toggle MEV Protector"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">MEV Detection</span>
                      <Badge className={mevProtectorEnabled ? "status-active" : "status-info"}>
                        {mevProtectorEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-vault-text-muted">Last Blocked Attack</span>
                      <span className="text-vault-text">None (Last 24h)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Activity className="h-5 w-5 text-vault-primary" /> Network Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Mempool Congestion</span>
                        <span className="text-vault-text">Low</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Average Gas Price</span>
                        <span className="text-vault-text">20 Gwei</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">MEV Risk Score</span>
                        <span className="text-vault-success">LOW (12/100)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => onAction("Configure MEV Protector")}
                  disabled={!isConnected}
                  className="btn-primary flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" /> Manage Settings
                </Button>
                <Button
                  onClick={() => onAction("Test MEV Protector")}
                  disabled={!isConnected || !mevProtectorEnabled}
                  className="btn-secondary flex-1"
                >
                  <Play className="h-4 w-4 mr-2" /> Test MEV Protector
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Liquidation Guard Tab */}
          <TabsContent value="liquidation-guard" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-6 scrollbar-thin scrollbar-thumb-vault-primary scrollbar-track-transparent">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-vault-danger" /> Liquidation Guard: LTV Monitoring
              </h3>
              <p className="text-vault-text-muted mb-6">
                Monitor your loan-to-value (LTV) ratio in real-time and receive alerts or trigger automated actions to
                prevent liquidation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Shield className="h-5 w-5 text-vault-success" /> Guard Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">Liquidation Guard Status</span>
                      <Switch
                        checked={liquidationGuardEnabled}
                        onCheckedChange={setLiquidationGuardEnabled}
                        disabled={!isConnected}
                        aria-label="Toggle Liquidation Guard"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">LTV Monitoring</span>
                      <Badge className={liquidationGuardEnabled ? "status-active" : "status-info"}>
                        {liquidationGuardEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-vault-text-muted">Last Alert</span>
                      <span className="text-vault-text">None</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-vault-warning" /> Your Positions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Vault #123 LTV</span>
                        <span className="text-vault-success">45%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Liquidation Threshold</span>
                        <span className="text-vault-text">80%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Collateral Value</span>
                        <span className="text-vault-text">$10,000 USD</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => onAction("Configure Liquidation Guard")}
                  disabled={!isConnected}
                  className="btn-primary flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" /> Configure Alerts
                </Button>
                <Button
                  onClick={() => onAction("Test Liquidation Guard")}
                  disabled={!isConnected || !liquidationGuardEnabled}
                  className="btn-secondary flex-1"
                >
                  <Play className="h-4 w-4 mr-2" /> Test Liquidation Guard
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* AutoYield Switcher Tab */}
          <TabsContent value="yield-switcher" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-6 scrollbar-thin scrollbar-thumb-vault-primary scrollbar-track-transparent">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-vault-success" /> AutoYield Switcher: Smart Strategies
              </h3>
              <p className="text-vault-text-muted mb-6">
                Automatically identify and switch to the highest-yielding DeFi pools and strategies based on AI analysis
                and real-time data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Brain className="h-5 w-5 text-vault-primary" /> Strategy Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">AutoYield Switcher Status</span>
                      <Switch
                        checked={autoYieldSwitcherEnabled}
                        onCheckedChange={setAutoYieldSwitcherEnabled}
                        disabled={!isConnected}
                        aria-label="Toggle AutoYield Switcher"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-vault-text-muted">Yield Optimization</span>
                      <Badge className={autoYieldSwitcherEnabled ? "status-active" : "status-info"}>
                        {autoYieldSwitcherEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-vault-text-muted">Last Optimization</span>
                      <span className="text-vault-text">1 hour ago</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card-light border-vault-border">
                  <CardHeader>
                    <CardTitle className="text-vault-text flex items-center gap-2">
                      <Activity className="h-5 w-5 text-vault-primary" /> Top Yield Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Pool A (USDC)</span>
                        <span className="text-vault-success">8.5% APR</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Pool B (ETH)</span>
                        <span className="text-vault-text">6.2% APR</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vault-text-muted">Pool C (DAI)</span>
                        <span className="text-vault-text">7.1% APR</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => onAction("Configure Yield Switcher")}
                  disabled={!isConnected}
                  className="btn-primary flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" /> Manage Strategies
                </Button>
                <Button
                  onClick={() => onAction("Test AutoYield Switcher")}
                  disabled={!isConnected || !autoYieldSwitcherEnabled}
                  className="btn-secondary flex-1"
                >
                  <Play className="h-4 w-4 mr-2" /> Test AutoYield Switcher
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
