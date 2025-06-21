"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, User, Send, Loader2, MessageSquare, FileText, Clock } from "lucide-react"
import { dummyAiResponses } from "@/lib/dummy-data"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface AiChatSidebarProps {
  onTriggerAction: (actionType: string) => void
  auditLogs: { timestamp: string; event: string; details: any }[]
  currentStep: number
}

interface ChatMessage {
  sender: "user" | "ai"
  text: string
  isTyping?: boolean
}

interface LogEntry {
  timestamp: string
  event: string
  details: any
  elizaValidation?: string
  status?: "success" | "warning" | "error" | "info"
}

export function AiChatSidebar({ onTriggerAction, auditLogs, currentStep }: AiChatSidebarProps) {
  const [mode, setMode] = useState<"chat" | "log">("chat")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [processedLogs, setProcessedLogs] = useState<LogEntry[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isAiTyping, processedLogs])

  // Process audit logs with ElizaOS validation
  useEffect(() => {
    const newProcessedLogs = auditLogs.map((log) => {
      let elizaValidation = ""
      let status: "success" | "warning" | "error" | "info" = "info"

      switch (log.event) {
        case "WalletConnected":
          elizaValidation = "✅ ElizaOS: Wallet connection verified and secure"
          status = "success"
          break
        case "VaultScanEvent":
          if (log.details.volatility === "Volatile") {
            elizaValidation = "⚠️ ElizaOS: High risk detected - immediate action recommended"
            status = "warning"
          } else {
            elizaValidation = "✅ ElizaOS: Vault analysis complete - low risk confirmed"
            status = "success"
          }
          break
        case "AttackDetected":
          elizaValidation = "🚨 ElizaOS: Attack simulation validated - vulnerability confirmed"
          status = "error"
          break
        case "LiquidationRiskPrevented":
          elizaValidation = "🛡️ ElizaOS: Protection activated successfully"
          status = "success"
          break
        case "BadgeMinted":
          elizaValidation = "🏅 ElizaOS: Security badge verified on-chain"
          status = "success"
          break
        default:
          elizaValidation = "📝 ElizaOS: Event logged and processed"
          status = "info"
      }

      return {
        ...log,
        elizaValidation,
        status,
      }
    })

    setProcessedLogs(newProcessedLogs)
  }, [auditLogs])

  const handleSendMessage = (messageText: string = input) => {
    if (messageText.trim() === "") return

    const userMessage: ChatMessage = { sender: "user", text: messageText.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsAiTyping(true)

    setTimeout(
      () => {
        const lowerInput = userMessage.text.toLowerCase()
        let aiResponseText = "Sorry, I don't understand your question. Can you ask in a different way?"
        let triggeredAction: string | null = null

        // Step-aware responses
        if (currentStep === 1 && lowerInput.includes("connect")) {
          aiResponseText = "Great! Let's connect your wallet first. Click the 'CONNECT NOW' button above."
          triggeredAction = "Connect Wallet"
        } else if (currentStep === 2 && (lowerInput.includes("scan") || lowerInput.includes("check"))) {
          aiResponseText = "Perfect! Now let's scan your vault for security risks. I'll initiate the scan."
          triggeredAction = "Scan Vault"
        } else if (lowerInput.includes("activate protection") || lowerInput.includes("protect wallet")) {
          aiResponseText = "Okay, I will activate anti-liquidation protection for your wallet."
          triggeredAction = "Activate Anti-Liquidation"
        } else if (lowerInput.includes("scan vault") || lowerInput.includes("check risk")) {
          aiResponseText = "Starting vault risk scan now. Please wait for the results."
          triggeredAction = "Scan Vault"
        } else if (lowerInput.includes("which vault is most optimal") || lowerInput.includes("yield recommendation")) {
          aiResponseText = dummyAiResponses["which vault is most optimal?"]
          triggeredAction = "Optimize Yield"
        } else if (lowerInput.includes("why is vault a risky")) {
          aiResponseText = dummyAiResponses["why is vault a risky?"]
        } else if (lowerInput.includes("simulate attack")) {
          aiResponseText = "Initiating attack simulation to test your vault's resilience."
          triggeredAction = "Simulate Attack"
        } else {
          for (const key in dummyAiResponses) {
            if (lowerInput.includes(key.toLowerCase())) {
              aiResponseText = dummyAiResponses[key]
              break
            }
          }
        }

        setIsAiTyping(false)
        const aiMessage: ChatMessage = { sender: "ai", text: aiResponseText }
        setMessages((prev) => [...prev, aiMessage])

        if (triggeredAction) {
          onTriggerAction(triggeredAction)
        }
      },
      1500 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const getStepAwarePrompts = () => {
    switch (currentStep) {
      case 1:
        return ["Connect my wallet", "How to start?", "What is VaultGuard?"]
      case 2:
        return ["Scan my vault", "Check security", "What are the risks?"]
      case 3:
        return ["Optimize yield", "Protect from liquidation", "Simulate attack"]
      default:
        return ["Which is my best vault?", "Why is the risk high?", "Activate protection", "Simulate attack"]
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "🚨"
      default:
        return "📝"
    }
  }

  return (
    <Card className="fixed right-0 top-0 bottom-0 w-full md:w-[350px] lg:w-[400px] bg-card border-l border-neon-primary shadow-neon-glow flex flex-col text-vault-text z-50">
      <CardHeader className="pb-4 border-b border-vault-border">
        <CardTitle className="flex items-center gap-2 text-neon-primary text-neon-glow">
          <Brain className="h-6 w-6 text-neon-primary" /> ElizaOS Agent
        </CardTitle>

        {/* Mode Toggle */}
        <div className="flex gap-2 mt-2">
          <Button
            variant={mode === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("chat")}
            className={`flex-1 ${mode === "chat" ? "bg-neon-primary text-vault-dark" : "bg-vault-border text-vault-text border-neon-primary/50"}`}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button
            variant={mode === "log" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("log")}
            className={`flex-1 ${mode === "log" ? "bg-neon-primary text-vault-dark" : "bg-vault-border text-vault-text border-neon-primary/50"}`}
          >
            <FileText className="h-4 w-4 mr-1" />
            Logs
          </Button>
        </div>

        <p className="text-vault-text/80 text-sm mt-2">
          {mode === "chat"
            ? "Ask anything about your vault or security risks."
            : "Real-time activity validation by ElizaOS"}
        </p>
      </CardHeader>

      <ScrollArea className="flex-1 p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-primary scrollbar-track-transparent">
        {mode === "chat" ? (
          <>
            {messages.length === 0 && (
              <div className="text-center text-vault-text/50 text-sm italic">
                Start a conversation with your ElizaOS.
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && <Brain className="h-6 w-6 text-neon-primary flex-shrink-0" />}
                <div
                  className={`p-3 rounded-lg max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-neon-primary text-vault-dark rounded-br-none shadow-md"
                      : "bg-vault-border text-vault-text rounded-bl-none shadow-md border border-neon-primary/50"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && <User className="h-6 w-6 text-neon-accent flex-shrink-0" />}
              </div>
            ))}
            {isAiTyping && (
              <div className="flex items-center gap-3 justify-start">
                <Brain className="h-6 w-6 text-neon-primary flex-shrink-0" />
                <div className="p-3 rounded-lg bg-vault-border text-vault-text rounded-bl-none shadow-md border border-neon-primary/50 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-neon-primary" />
                  <span>Eliza is thinking...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {processedLogs.length === 0 && (
              <div className="text-center text-vault-text/50 text-sm italic">
                No activity logs yet. Start by connecting your wallet.
              </div>
            )}
            {processedLogs.map((log, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-vault-text/70">
                  <Clock className="h-3 w-3" />
                  <span>{log.timestamp}</span>
                  <Badge variant="outline" className="text-xs">
                    {log.event}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-vault-border border border-neon-primary/30">
                  <div className="text-sm text-vault-text mb-2">{JSON.stringify(log.details, null, 2)}</div>
                  {log.elizaValidation && (
                    <div
                      className={`text-sm font-medium flex items-center gap-2 ${
                        log.status === "success"
                          ? "text-neon-accent"
                          : log.status === "warning"
                            ? "text-neon-warning"
                            : log.status === "error"
                              ? "text-neon-warning"
                              : "text-neon-primary"
                      }`}
                    >
                      <Brain className="h-4 w-4" />
                      {log.elizaValidation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {mode === "chat" && (
        <div className="p-4 border-t border-vault-border">
          <div className="flex flex-wrap gap-2 mb-2">
            {getStepAwarePrompts().map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs h-auto py-1 px-2 bg-vault-border text-vault-text border-neon-primary/50 hover:bg-neon-primary/20 hover:text-neon-primary"
                disabled={isAiTyping}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-vault-border border border-neon-primary/50 text-vault-text placeholder:text-vault-text/50 focus:ring-neon-primary focus:border-neon-primary"
              disabled={isAiTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={input.trim() === "" || isAiTyping}
              className="bg-neon-primary text-vault-dark hover:bg-neon-accent shadow-md"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
