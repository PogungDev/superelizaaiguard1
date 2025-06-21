"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, User, Send, Clock, Zap, Shield, Activity, Loader2, Settings, BarChart3, DollarSign } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ElizaCommandCenterProps {
  onTriggerAction: (actionType: string) => void
  auditLogs: string[]
  currentStep: number
  elizaStatus: "ACTIVE" | "SCANNING" | "IDLE"
  onStatusChange: (status: "ACTIVE" | "SCANNING" | "IDLE") => void
  aiRecommendedAction: string | null
  getElizaAIResponse: (options: {
    userMessage: string
    elizaStatus: "ACTIVE" | "SCANNING" | "IDLE"
    currentStep: number
    aiRecommendedAction: string | null
    auditLogsSummary: string
  }) => Promise<{ responseText: string }>
  // New prop to receive direct system messages from actions
  systemActionMessage?: { message: string; type: "success" | "warning" | "info" | "error"; reasoning: string } | null
}

interface ChatMessage {
  sender: "user" | "eliza"
  text: string
  isTyping?: boolean
  priority?: "normal" | "warning" | "critical" | "error"
  timestamp?: string
}

interface LogEntry {
  timestamp: string
  event: string
  details: any
  elizaValidation?: string
  status?: "success" | "warning" | "error" | "info"
  priority?: "normal" | "high" | "critical"
}

export function ElizaCommandCenter({
  onTriggerAction,
  auditLogs,
  currentStep,
  elizaStatus,
  onStatusChange,
  aiRecommendedAction,
  getElizaAIResponse,
  systemActionMessage, // Destructure new prop
}: ElizaCommandCenterProps) {
  const [activeTab, setActiveTab] = useState("command")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "eliza",
      text: "ELIZA CORE ONLINE - Advanced AI Protection System Activated",
      priority: "critical",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isElizaProcessing, setIsElizaProcessing] = useState(false)
  const [processedLogs, setProcessedLogs] = useState<LogEntry[]>([])
  const [aiThinking, setAiThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, processedLogs])

  // Effect to process auditLogs into processedLogs for Intel tab
  useEffect(() => {
    const newProcessedLogs: LogEntry[] = auditLogs.map((logString) => ({
      timestamp: new Date().toLocaleTimeString(),
      event: "LogEntry",
      details: { message: logString }, // Here, details is an object { message: string }
      elizaValidation: logString,
      status: "info",
      priority: "normal",
    }))
    setProcessedLogs(newProcessedLogs)
  }, [auditLogs])

  // Effect to handle system action messages and add them to chat/logs
  useEffect(() => {
    if (systemActionMessage) {
      const { message, type, reasoning } = systemActionMessage
      const priorityMap = {
        success: "normal",
        info: "normal",
        warning: "warning",
        error: "error",
      } as const

      // Add to chat messages
      setMessages((prev) => [
        ...prev,
        {
          sender: "eliza",
          text: `ELIZA: ${message}`,
          priority: priorityMap[type],
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      // Add to processed logs for Intel tab
      setProcessedLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          event: "System Action",
          details: { action: message, type, reasoning }, // Here, details is an object { action: string, type: string, reasoning: string }
          elizaValidation: `Action completed: ${message}. Reasoning: ${reasoning}`,
          status: type,
          priority: type === "error" || type === "warning" ? "critical" : "normal",
        },
      ])
    }
  }, [systemActionMessage]) // Trigger when systemActionMessage changes

  useEffect(() => {
    if (aiRecommendedAction && !isElizaProcessing) {
      let messageText = ""
      let priority: "normal" | "warning" | "critical" | "error" = "normal"

      if (aiRecommendedAction === "Activate Anti-Liquidation") {
        messageText =
          "CRITICAL THREAT DETECTED! Chainlink Price Feeds indicate severe collateral depreciation. IMMEDIATE DEFENSIVE ACTION REQUIRED."
        priority = "critical"
      } else if (aiRecommendedAction === "Optimize Yield") {
        messageText =
          "Vault stability confirmed. Chainlink Functions analysis reveals superior yield opportunities across 47+ protocols."
        priority = "warning"
      } else if (aiRecommendedAction === "Scan Vault") {
        messageText =
          "Chainlink oracle network synchronized. Recommend comprehensive vault analysis for optimal protection."
        priority = "normal"
      }

      if (messageText && messages[messages.length - 1]?.text !== messageText) {
        setMessages((prev) => [
          ...prev,
          { sender: "eliza", text: messageText, priority, timestamp: new Date().toLocaleTimeString() },
        ])
      }
    }
  }, [aiRecommendedAction, isElizaProcessing, messages])

  const handleSendMessage = async (messageText: string = input) => {
    if (messageText.trim() === "") return

    const userMessage: ChatMessage = {
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsElizaProcessing(true)
    setAiThinking(true)
    onStatusChange("SCANNING")

    const auditLogsSummary = auditLogs.slice(-3).join("\n")

    try {
      const aiResponse = await getElizaAIResponse({
        userMessage: userMessage.text,
        elizaStatus,
        currentStep,
        aiRecommendedAction,
        auditLogsSummary,
      })

      const elizaResponseText = aiResponse.responseText
      let triggeredAction: string | null = null
      let priority: "normal" | "warning" | "critical" | "error" = "normal"

      const lowerInput = userMessage.text.toLowerCase()
      const lowerAIResponse = elizaResponseText.toLowerCase()

      if (lowerInput.includes("accept recommendation") && aiRecommendedAction) {
        triggeredAction = aiRecommendedAction
        priority = "critical"
      } else if (
        lowerInput.includes("initialize") ||
        lowerInput.includes("connect") ||
        lowerAIResponse.includes("connect wallet")
      ) {
        triggeredAction = "Connect Wallet"
        priority = "warning"
      } else if (
        lowerInput.includes("scan") ||
        lowerInput.includes("analyze") ||
        lowerAIResponse.includes("scan vault")
      ) {
        triggeredAction = "Initiate Vault Scan"
        priority = "critical"
      } else if (
        lowerInput.includes("protect") ||
        lowerInput.includes("defend") ||
        lowerAIResponse.includes("activate anti-liquidation")
      ) {
        triggeredAction = "Activate Anti-Liquidation"
        priority = "warning"
      } else if (
        lowerInput.includes("optimize") ||
        lowerInput.includes("yield") ||
        lowerAIResponse.includes("optimize yield")
      ) {
        triggeredAction = "Optimize Yield"
        priority = "normal"
      } else if (
        lowerInput.includes("status") ||
        lowerInput.includes("report") ||
        lowerAIResponse.includes("system status")
      ) {
        priority = "normal"
      }

      setAiThinking(false)
      setIsElizaProcessing(false)
      onStatusChange("ACTIVE")

      const elizaMessage: ChatMessage = {
        sender: "eliza",
        text: elizaResponseText,
        priority,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, elizaMessage])

      if (triggeredAction) {
        onTriggerAction(triggeredAction)
      }
    } catch (error) {
      console.error("Failed to get AI response:", error)
      setAiThinking(false)
      setIsElizaProcessing(false)
      onStatusChange("ACTIVE")
      setMessages((prev) => [
        ...prev,
        {
          sender: "eliza",
          text: "ELIZA: Communication error with AI core. Please try again.",
          priority: "error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const getSmartPrompts = () => {
    const prompts = []
    if (aiRecommendedAction && aiRecommendedAction !== "Loading...") {
      prompts.push("Accept AI Recommendation")
    }
    switch (currentStep) {
      case 1:
        prompts.push("Initialize connection", "Deploy security protocols", "System status")
        break
      case 2:
        prompts.push("Scan for vulnerabilities", "Analyze threat vectors", "Check vault integrity")
        break
      case 3:
        prompts.push("Deploy countermeasures", "Optimize defenses", "Execute protection")
        break
      default:
        prompts.push("Status report", "Threat analysis", "Deploy defenses", "Optimize yield")
        break
    }
    return Array.from(new Set(prompts))
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-amber-600"
      case "high":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-amber-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getElizaStatusBadge = () => {
    switch (elizaStatus) {
      case "ACTIVE":
        return (
          <Badge className="status-cyber-active">
            <Activity className="h-3 w-3 mr-1" />
            ACTIVE
          </Badge>
        )
      case "SCANNING":
        return (
          <Badge className="status-cyber-warning">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            SCANNING
          </Badge>
        )
      case "IDLE":
        return (
          <Badge className="status-cyber-info">
            <Clock className="h-3 w-3 mr-1" />
            IDLE
          </Badge>
        )
    }
  }

  return (
    <Card className="cyber-card flex flex-col text-foreground h-full">
      <CardHeader className="pb-4 border-b border-border bg-muted/30">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                  elizaStatus === "ACTIVE"
                    ? "bg-green-500"
                    : elizaStatus === "SCANNING"
                      ? "bg-amber-500"
                      : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">ELIZA COMMAND CENTER</div>
              <div className="text-sm text-muted-foreground">Advanced AI Protection System</div>
            </div>
          </div>
          <div className="flex items-center gap-2">{getElizaStatusBadge()}</div>
        </CardTitle>

        {aiThinking && (
          <div className="mt-4 p-4 bg-muted/50 border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">ELIZA is analyzing...</p>
                <Progress value={85} className="h-2 mt-2" />
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger
              value="command"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="h-4 w-4 mr-2" />
              Command
            </TabsTrigger>
            <TabsTrigger
              value="intel"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4 mr-2" />
              Intel
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <Tabs value={activeTab} className="flex-1 flex flex-col">
        <TabsContent value="command" className="flex-1 flex flex-col m-0">
          <ScrollArea className="flex-1 p-4 scrollbar-cyber">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"} fade-in-cyber`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {msg.sender === "eliza" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center border border-primary/40">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md p-4"
                        : `bg-muted rounded-2xl rounded-bl-md p-4 border ${
                            msg.priority === "critical" || msg.priority === "error"
                              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                              : msg.priority === "warning"
                                ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
                                : "border-border"
                          }`
                    }`}
                  >
                    <div
                      className={`${
                        msg.sender === "eliza" ? getPriorityColor(msg.priority) : ""
                      } cyber-mono text-sm leading-relaxed`}
                    >
                      {msg.text}
                    </div>
                    {msg.timestamp && <div className="text-xs opacity-70 mt-2 cyber-text">{msg.timestamp}</div>}
                  </div>
                  {msg.sender === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-lg flex items-center justify-center border border-green-500/40">
                        <User className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-border bg-gradient-to-r from-card/30 to-card/10">
            <div className="flex flex-wrap gap-2 mb-4">
              {getSmartPrompts().map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-xs h-auto py-2 px-3"
                  disabled={isElizaProcessing}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isElizaProcessing}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={input.trim() === "" || isElizaProcessing}
                className="btn-cyber-primary px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="intel" className="flex-1 flex flex-col m-0">
          <ScrollArea className="flex-1 p-4 scrollbar-cyber">
            <div className="space-y-4">
              {processedLogs.length === 0 && (
                <div className="text-center text-muted-foreground text-sm italic cyber-mono py-12">
                  <div className="animate-pulse">INTEL FEED AWAITING DATA...</div>
                </div>
              )}
              {processedLogs.map((log, index) => {
                // Ensure log.details is stringified, and handle potential non-object details
                const detailsString =
                  typeof log.details === "object" && log.details !== null
                    ? JSON.stringify(log.details, null, 2)
                    : String(log.details) // Fallback to String() for non-objects

                return (
                  <div
                    key={index}
                    className={`glass-card-light border rounded-xl p-4 fade-in-cyber ${
                      log.priority === "critical"
                        ? "border-red-500/60 bg-red-500/10" // Changed from neon-danger
                        : log.priority === "high"
                          ? "border-yellow-500/60 bg-yellow-500/10" // Changed from neon-warning
                          : "border-primary/40" // Changed from vault-primary
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 text-xs mb-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground cyber-mono">{log.timestamp}</span>
                      <Badge
                        variant="outline"
                        className="text-xs cyber-mono bg-secondary/50 border-border text-foreground"
                      >
                        {log.event}
                      </Badge>
                      {log.priority === "critical" && <Badge className="status-cyber-inactive text-xs">CRITICAL</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground cyber-mono mb-3 bg-gradient-to-r from-card/40 to-card/20 p-3 rounded-lg border border-border">
                      {detailsString} {/* Use the prepared string */}
                    </div>
                    {log.elizaValidation && (
                      <div
                        className={`text-sm cyber-mono flex items-start gap-2 ${getStatusColor(log.status || "info")}`}
                      >
                        <Brain className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{log.elizaValidation}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system" className="flex-1 flex flex-col m-0">
          <ScrollArea className="flex-1 p-4 scrollbar-cyber">
            <div className="p-4 space-y-6">
              <div className="glass-card-light p-6 rounded-xl border border-primary/40 fade-in-cyber">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-3 text-primary cyber-title">
                  <Activity className="h-5 w-5 text-primary" />
                  System Status
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { name: "AI Core", status: "Online", color: "active" }, // Changed from vault-success
                    { name: "Chainlink", status: "Connected", color: "active" }, // Changed from vault-success
                    { name: "Security", status: "Active", color: "active" }, // Changed from vault-success
                    { name: "Monitoring", status: "24/7", color: "info" }, // Changed from vault-primary
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-card/40 to-card/20 border border-border/50"
                    >
                      <span className="text-muted-foreground cyber-text">{item.name}</span>
                      <Badge className={`status-cyber-${item.color}`}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="glass-card-light p-6 rounded-xl border border-primary/40 fade-in-cyber"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-3 text-primary cyber-title">
                  <Shield className="h-5 w-5 text-primary" />
                  Protection Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground cyber-text">Threat Detection</span>
                      <span className="text-green-500 cyber-mono">98%</span> {/* Changed from neon-success */}
                    </div>
                    <div className="progress-cyber h-3">
                      <div className="progress-cyber-fill h-full" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground cyber-text">Response Time</span>
                      <span className="text-primary cyber-mono">{"< 2s"}</span> {/* Changed from neon-primary */}
                    </div>
                    <div className="progress-cyber h-3">
                      <div className="progress-cyber-fill h-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-card-light p-6 rounded-xl border border-primary/40 fade-in-cyber"
                style={{ animationDelay: "0.4s" }}
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-3 text-primary cyber-title">
                  <Brain className="h-5 w-5 text-primary" />
                  Chainlink Service Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      name: "Price Feeds",
                      status: "Operational",
                      icon: DollarSign,
                      description: "Real-time asset pricing for vault health and liquidation checks.",
                    },
                    {
                      name: "Data Streams",
                      status: "Monitoring",
                      icon: Activity,
                      description: "Continuous monitoring of on-chain events and market data.",
                    },
                    {
                      name: "Automation",
                      status: "Ready for Triggers",
                      icon: Zap,
                      description: "Automated execution of smart contract functions based on predefined conditions.",
                    },
                    {
                      name: "Functions",
                      status: "Available for AI",
                      icon: BarChart3,
                      description: "Secure off-chain computation for MEV analysis and yield optimization.",
                    },
                  ].map((service, index) => {
                    const Icon = service.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-card/40 to-card/20 rounded-lg border border-border/50 hover:border-primary/40 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/40">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground cyber-text">
                            {service.name} <Badge className="status-cyber-active ml-2">{service.status}</Badge>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 cyber-text leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
