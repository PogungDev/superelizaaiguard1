"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Bot, MessageCircle, FileText, Zap, Send, Activity, Clock, CheckCircle, AlertTriangle, X } from "lucide-react"

interface ElizaChatPanelProps {
  onTriggerAction: (action: string) => void
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
  }) => Promise<any>
  systemActionMessage?: {
    message: string
    type: "success" | "warning" | "info" | "error"
    reasoning: string
  } | null
}

interface ChatMessage {
  id: string
  type: "user" | "eliza" | "system"
  content: string
  timestamp: Date
  status?: "success" | "warning" | "info" | "error"
}

export const ElizaChatPanel: React.FC<ElizaChatPanelProps> = ({
  onTriggerAction,
  auditLogs,
  currentStep,
  elizaStatus,
  onStatusChange,
  aiRecommendedAction,
  getElizaAIResponse,
  systemActionMessage,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "eliza",
      content:
        "Hi! I'm Eliza, your AI DeFi assistant powered by Chainlink. I can help you connect wallets, find yield opportunities, deploy vaults, and optimize your strategies. Just tell me what you'd like to do!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add system messages when actions are performed
  useEffect(() => {
    if (systemActionMessage) {
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        type: "system",
        content: systemActionMessage.message,
        timestamp: new Date(),
        status: systemActionMessage.type,
      }
      setMessages((prev) => [...prev, systemMessage])
    }
  }, [systemActionMessage])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await getElizaAIResponse({
        userMessage: inputMessage,
        elizaStatus,
        currentStep,
        aiRecommendedAction,
        auditLogsSummary: auditLogs.slice(-5).join("; "),
      })

      const elizaMessage: ChatMessage = {
        id: `eliza-${Date.now()}`,
        type: "eliza",
        content: response.response || "I'm processing your request...",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, elizaMessage])

      if (response.suggestedAction) {
        setTimeout(() => {
          onTriggerAction(response.suggestedAction)
        }, 1000)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "system",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
        status: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: string) => {
    onTriggerAction(action)

    const actionMessage: ChatMessage = {
      id: `action-${Date.now()}`,
      type: "user",
      content: `Execute: ${action}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, actionMessage])
  }

  const getStatusIcon = () => {
    switch (elizaStatus) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "SCANNING":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case "IDLE":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (elizaStatus) {
      case "ACTIVE":
        return "bg-green-500"
      case "SCANNING":
        return "bg-blue-500"
      case "IDLE":
        return "bg-gray-500"
      default:
        return "bg-yellow-500"
    }
  }

  const quickActions = [
    "Connect Wallet",
    "Scan Vault",
    "Find Yield",
    "Deploy Vault",
    "Activate Anti-Liquidation",
    "Optimize Yield",
    "Simulate Attack",
    "Check Status",
  ]

  if (!isOpen) {
    return (
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-l-lg rounded-r-none px-3 py-8 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-1/4 z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-blue-500/30 shadow-2xl backdrop-blur-sm rounded-l-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 py-3 border-b border-blue-500/30 backdrop-blur-sm rounded-tl-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-slate-900`}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Eliza AI Assistant</h3>
              <p className="text-xs text-blue-300 flex items-center gap-1">
                {getStatusIcon()}
                {elizaStatus}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-80px)]">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-b border-blue-500/30">
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300"
            >
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
            {/* Messages Area - Fixed Scrolling */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth max-h-[calc(100vh-360px)]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : message.type === "system"
                          ? `bg-gradient-to-r ${
                              message.status === "error"
                                ? "from-red-600/20 to-red-700/20 border border-red-500/30"
                                : message.status === "warning"
                                  ? "from-yellow-600/20 to-yellow-700/20 border border-yellow-500/30"
                                  : message.status === "success"
                                    ? "from-green-600/20 to-green-700/20 border border-green-500/30"
                                    : "from-blue-600/20 to-blue-700/20 border border-blue-500/30"
                            } text-white`
                          : "bg-gradient-to-r from-slate-700 to-slate-600 text-white border border-blue-500/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-lg px-3 py-2 shadow-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-blue-500/30 bg-slate-800/30 mt-auto">
              <div className="mb-3">
                <p className="text-xs text-blue-300 mb-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action) => (
                    <Button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 hover:text-white transition-all duration-200"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about DeFi..."
                  className="flex-1 bg-slate-700/50 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 mt-0 min-h-0">
            <div className="h-full overflow-y-auto px-4 py-4 max-h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No audit logs yet</p>
                ) : (
                  auditLogs.map((log, index) => (
                    <div
                      key={index}
                      className="text-xs p-3 bg-slate-700/30 border border-blue-500/20 rounded-lg text-gray-300 font-mono"
                    >
                      <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
