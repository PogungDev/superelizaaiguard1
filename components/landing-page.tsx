"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  TrendingUp,
  Award,
  ArrowRight,
  AlertTriangle,
  Brain,
  Eye,
  Lock,
  BarChart3,
  Users,
  Star,
  Info,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

export function LandingPage({ onGetStarted, onLearnMore }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: "MEV Protection",
      description: "Advanced AI algorithms detect and prevent MEV attacks before they happen",
      color: "text-vault-primary",
      bgColor: "bg-vault-primary/10",
    },
    {
      icon: AlertTriangle,
      title: "Liquidation Prevention",
      description: "Real-time monitoring with automated protection triggers",
      color: "text-vault-warning",
      bgColor: "bg-vault-warning/10",
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "AI-powered recommendations for maximum returns across protocols",
      color: "text-vault-success",
      bgColor: "bg-vault-success/10",
    },
    {
      icon: Award,
      title: "Security Certification",
      description: "On-chain verification of your wallet's protection status",
      color: "text-vault-primary",
      bgColor: "bg-vault-primary/10",
    },
  ]

  const stats = [
    { value: "$900M", label: "Protected from MEV attacks annually", icon: Shield },
    { value: "72%", label: "Reduction in liquidation risk", icon: TrendingUp },
    { value: "2.5x", label: "Average yield improvement", icon: BarChart3 },
    { value: "24/7", label: "AI monitoring & protection", icon: Eye },
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "DeFi Trader",
      content: "Super Eliza AI Guard saved me from a $50K liquidation. The AI detected the risk before I even noticed.",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      role: "Yield Farmer",
      content: "Increased my yields by 180% while reducing risk. The Chainlink integration is game-changing.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Protocol Developer",
      content: "The most sophisticated DeFi protection I've seen. ElizaOS makes complex decisions simple.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-vault-dark via-vault-darker to-vault-dark text-vault-text">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-vault-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-vault-success/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-vault-warning/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Alert Banner */}
            <div className="inline-flex items-center gap-3 glass-card-light px-6 py-3 rounded-full mb-8 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-vault-warning" />
              <span className="text-sm font-medium text-vault-text">
                <span className="text-vault-warning font-bold">$900M</span> lost annually to MEV attacks & liquidations
              </span>
              <Badge className="bg-vault-danger/20 text-vault-danger border-vault-danger/30">Critical</Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gradient">Protect</span> Your <span className="text-vault-success">DeFi</span>
              <br />
              <span className="text-vault-text">Investments</span>
            </h1>

            <p className="text-xl md:text-2xl text-vault-text-muted mb-12 max-w-4xl mx-auto leading-relaxed">
              Super Eliza AI Guard combines <span className="text-vault-primary font-semibold">Chainlink oracles</span>{" "}
              with <span className="text-vault-success font-semibold">ElizaOS AI</span> to protect your crypto from MEV
              attacks, prevent liquidations, and optimize yields across DeFi protocols.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={onGetStarted}
                className="btn-primary px-8 py-4 text-lg font-semibold shadow-vault-glow group"
              >
                Start Protection Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={onLearnMore}
                variant="outline"
                className="border-vault-primary text-vault-primary hover:bg-vault-primary/10 px-8 py-4 text-lg font-semibold"
              >
                <Brain className="mr-2 h-5 w-5" />
                How AI Works
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="glass-card-light p-4 rounded-xl mb-3 group-hover:bg-vault-card/50 transition-all duration-200">
                      <Icon className="h-6 w-6 text-vault-primary mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-vault-primary mb-1">{stat.value}</div>
                    </div>
                    <div className="text-sm text-vault-text-muted">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="status-info mb-4">Core Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-vault-text mb-6">
              Why Choose <span className="text-gradient">Super Eliza AI Guard</span>?
            </h2>
            <p className="text-xl text-vault-text-muted max-w-3xl mx-auto">
              Advanced AI protection powered by real-time Chainlink data and intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="glass-card border-vault-border group transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-vault-glow"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-vault-text">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-vault-text-muted text-center leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* How It Works Preview */}
      <div className="py-20 lg:py-32 bg-vault-card/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="status-active mb-4">Simple Process</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-vault-text mb-6">Get Protected in 3 Steps</h2>
            <p className="text-xl text-vault-text-muted">Start protecting your DeFi investments in under 2 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Securely link your wallet with read-only access",
                icon: Lock,
                color: "vault-primary",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "ElizaOS scans your positions using Chainlink data",
                icon: Brain,
                color: "vault-success",
              },
              {
                step: "03",
                title: "Stay Protected",
                description: "Receive alerts and automated protection 24/7",
                icon: Shield,
                color: "vault-warning",
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div
                      className={`w-24 h-24 mx-auto glass-card rounded-2xl flex items-center justify-center border-2 border-${item.color} group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className={`h-12 w-12 text-${item.color}`} />
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    >
                      {item.step}
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-12 left-full w-8 h-0.5 bg-vault-border transform -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-vault-text mb-3">{item.title}</h3>
                  <p className="text-vault-text-muted leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="status-success mb-4">Testimonials</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-vault-text mb-6">
              Trusted by <span className="text-gradient">DeFi Users</span>
            </h2>
            <p className="text-xl text-vault-text-muted">
              See what our users say about Super Eliza AI Guard protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="glass-card border-vault-border transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-vault-glow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-vault-warning text-vault-warning" />
                    ))}
                  </div>
                  <p className="text-vault-text-muted mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-vault-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-vault-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-vault-text">{testimonial.name}</div>
                      <div className="text-sm text-vault-text-muted">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 lg:py-32 bg-gradient-to-r from-vault-primary/10 via-vault-success/10 to-vault-primary/10 border-t border-vault-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-vault-text mb-6">
            Ready to Protect Your <span className="text-gradient">DeFi Portfolio</span>?
          </h2>
          <p className="text-xl text-vault-text-muted mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust Super Eliza AI Guard's AI-powered protection to keep their crypto safe and
            optimized
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              className="btn-primary px-8 py-4 text-lg font-semibold shadow-vault-glow group"
            >
              Start Free Protection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={onLearnMore}
              variant="outline"
              className="border-vault-success text-vault-success hover:bg-vault-success/10 px-8 py-4 text-lg font-semibold"
            >
              <Info className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
