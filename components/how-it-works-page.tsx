"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, TrendingUp, AlertTriangle, ArrowRight, CheckCircle, Brain, Eye, Wallet } from "lucide-react"

interface HowItWorksPageProps {
  onTryDemo: () => void
}

export function HowItWorksPage({ onTryDemo }: HowItWorksPageProps) {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Securely link your wallet to VaultGuard. We support all major wallets and never store your keys.",
      icon: Wallet,
      details: [
        "MetaMask, WalletConnect, and more",
        "Read-only access for security",
        "No private key storage",
        "Instant connection setup",
      ],
      color: "vault-primary", // Changed from neon-primary
    },
    {
      number: "02",
      title: "AI Scans Your Positions",
      description:
        "Our AI analyzes your DeFi positions, checking for MEV risks, liquidation threats, and yield opportunities.",
      icon: Brain,
      details: [
        "Real-time risk assessment",
        "MEV attack detection",
        "Liquidation risk analysis",
        "Yield optimization scanning",
      ],
      color: "vault-success", // Changed from neon-accent
    },
    {
      number: "03",
      title: "Get Intelligent Alerts",
      description: "Receive instant notifications about threats, opportunities, and recommended actions.",
      icon: AlertTriangle,
      details: [
        "MEV attack warnings",
        "Liquidation risk alerts",
        "Yield opportunity notifications",
        "Smart contract risk updates",
      ],
      color: "vault-warning", // Changed from neon-warning
    },
    {
      number: "04",
      title: "Take Protective Actions",
      description: "Execute AI-recommended actions to protect your funds and optimize your yields.",
      icon: Shield,
      details: [
        "One-click protection activation",
        "Automated yield optimization",
        "Emergency liquidation prevention",
        "Portfolio rebalancing suggestions",
      ],
      color: "vault-primary",
    },
  ]

  const problems = [
    {
      title: "MEV Attacks",
      description: "Front-running and sandwich attacks steal value from your transactions",
      impact: "$900M lost annually",
      icon: Zap,
      solution: "Real-time MEV detection and protection strategies",
    },
    {
      title: "Liquidation Risk",
      description: "Sudden price movements can liquidate your leveraged positions",
      impact: "72% of users affected",
      icon: AlertTriangle,
      solution: "Early warning system with automated protection",
    },
    {
      title: "Suboptimal Yields",
      description: "Missing better yield opportunities across different protocols",
      impact: "Average 2.5x improvement possible",
      icon: TrendingUp,
      solution: "AI-powered yield optimization recommendations",
    },
  ]

  const features = [
    {
      title: "ElizaOS AI Agent",
      description: "Advanced AI that understands DeFi risks and opportunities",
      icon: Brain,
      capabilities: [
        "Natural language interaction",
        "Risk pattern recognition",
        "Predictive analysis",
        "24/7 monitoring",
      ],
    },
    {
      title: "Real-time Monitoring",
      description: "Continuous surveillance of your positions and market conditions",
      icon: Eye,
      capabilities: ["Live price tracking", "Transaction monitoring", "Risk score updates", "Market trend analysis"],
    },
    {
      title: "Smart Automation",
      description: "Automated responses to protect your investments",
      icon: Zap,
      capabilities: ["Auto-liquidation prevention", "Yield rebalancing", "Risk mitigation", "Emergency protocols"],
    },
  ]

  return (
    <div className="min-h-screen bg-vault-dark text-vault-text">
      {/* Hero Section */}
      <div className="py-20 bg-gradient-to-b from-vault-dark to-vault-dark/50">
        <div className="container mx-auto px-6 text-center">
          <Badge className="bg-neon-primary/20 text-neon-primary border-neon-primary mb-6">How It Works</Badge>
          <h1 className="text-5xl font-bold text-neon-primary mb-6">Understand VaultGuard</h1>
          <p className="text-xl text-vault-text/80 max-w-3xl mx-auto mb-8">
            Learn how our AI-powered system protects your DeFi investments from common threats and optimizes your yields
            automatically.
          </p>
          <Button
            onClick={onTryDemo}
            className="bg-neon-primary text-vault-dark font-bold py-3 px-6 shadow-neon-glow hover:bg-neon-accent"
          >
            Try Interactive Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Problems We Solve */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neon-primary mb-4">Problems We Solve</h2>
            <p className="text-xl text-vault-text/80">The biggest threats to your DeFi investments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon
              return (
                <Card key={index} className="bg-card/80 backdrop-blur border border-neon-warning/30 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-neon-warning/20 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-neon-warning" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-neon-warning">{problem.title}</CardTitle>
                        <Badge variant="outline" className="text-xs text-neon-warning border-neon-warning/50">
                          {problem.impact}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-vault-text/80 mb-4">{problem.description}</p>
                    <div className="p-3 bg-neon-accent/10 border border-neon-accent/30 rounded-lg">
                      <p className="text-sm text-neon-accent font-medium">✅ Our Solution:</p>
                      <p className="text-sm text-vault-text/80 mt-1">{problem.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step by Step Process */}
      <div className="py-20 bg-vault-dark/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neon-primary mb-4">Step-by-Step Process</h2>
            <p className="text-xl text-vault-text/80">How VaultGuard protects your investments</p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 bg-${step.color}/20 rounded-full flex items-center justify-center border-2 border-${step.color}`}
                      >
                        <Icon className={`h-8 w-8 text-${step.color}`} />
                      </div>
                      <div>
                        <Badge className={`bg-${step.color}/20 text-${step.color} border-${step.color} mb-2`}>
                          Step {step.number}
                        </Badge>
                        <h3 className={`text-2xl font-bold text-${step.color}`}>{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-lg text-vault-text/80 mb-6">{step.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle className={`h-4 w-4 text-${step.color}`} />
                          <span className="text-sm text-vault-text/80">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <Card className={`bg-card/80 backdrop-blur border border-${step.color}/30 shadow-lg p-8`}>
                      <div className="text-center">
                        <div
                          className={`w-24 h-24 mx-auto bg-${step.color}/20 rounded-full flex items-center justify-center mb-4`}
                        >
                          <Icon className={`h-12 w-12 text-${step.color}`} />
                        </div>
                        <div className={`text-4xl font-bold text-${step.color} mb-2`}>{step.number}</div>
                        <div className="text-lg text-vault-text">{step.title}</div>
                      </div>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neon-primary mb-4">Key Features</h2>
            <p className="text-xl text-vault-text/80">Advanced technology powering your protection</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-card/80 backdrop-blur border border-neon-primary/30 shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-neon-primary/20 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-neon-primary" />
                    </div>
                    <CardTitle className="text-xl text-neon-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-vault-text/80 mb-6">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.capabilities.map((capability, capIndex) => (
                        <div key={capIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-neon-accent" />
                          <span className="text-sm text-vault-text/80">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-vault-dark/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neon-primary mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Is VaultGuard safe to use?",
                a: "Yes, VaultGuard only requires read-only access to your wallet. We never store private keys or have access to your funds.",
              },
              {
                q: "How does the AI detect MEV attacks?",
                a: "Our AI analyzes transaction patterns, mempool data, and market conditions to identify potential MEV threats before they happen.",
              },
              {
                q: "What wallets are supported?",
                a: "We support all major wallets including MetaMask, WalletConnect, Coinbase Wallet, and more.",
              },
              {
                q: "How much does VaultGuard cost?",
                a: "VaultGuard is free to use for basic protection. Premium features are available for advanced users.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur border border-neon-primary/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-neon-primary mb-2">{faq.q}</h3>
                  <p className="text-vault-text/80">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-neon-primary mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-vault-text/80 mb-8">
            Try VaultGuard now and see how it protects your DeFi investments
          </p>
          <Button
            onClick={onTryDemo}
            className="bg-neon-primary text-vault-dark font-bold py-4 px-8 text-lg shadow-neon-glow hover:bg-neon-accent"
          >
            Start Free Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
