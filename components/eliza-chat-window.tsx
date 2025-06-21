"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Maximize2, Minimize2, X, Send, Bot, User, MessageSquare, FileText } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "eliza" | "system"
  content: string
  timestamp: Date
  priority?: "normal" | "high" | "critical"
}

interface ElizaChatWindowProps {
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
  }) => Promise<{ responseText: string; actionToTrigger?: string | null }>
  systemActionMessage?: {
    message: string
    type: "success" | "warning" | "info" | "error"
    reasoning: string
  } | null
}

export function ElizaChatWindow({
  onTriggerAction,
  auditLogs,
  currentStep,
  elizaStatus,
  onStatusChange,
  aiRecommendedAction,
  getElizaAIResponse,
  systemActionMessage,
}: ElizaChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "eliza",
      content:
        "Hi! I'm Eliza, your AI DeFi assistant powered by Chainlink. I can help you connect wallets, find yield opportunities, deploy vaults, and optimize your strategies. Just tell me what you'd like to do!",
      timestamp: new Date(),
      priority: "normal",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isElizaProcessing, setIsElizaProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [processedAuditLogCount, setProcessedAuditLogCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const auditLogsEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (tab?: string) => {
    const currentTab = tab || activeTab
    if (currentTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } else if (currentTab === "audit") {
      auditLogsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeTab])

  useEffect(() => {
    scrollToBottom("audit")
  }, [auditLogs])

  // Convert new audit logs to chat messages
  useEffect(() => {
    if (auditLogs.length > processedAuditLogCount) {
      const newLogs = auditLogs.slice(processedAuditLogCount)
      const newMessages: Message[] = newLogs.map((log, index) => ({
        id: `audit-${processedAuditLogCount + index}-${Date.now()}`,
        sender: "system",
        content: log,
        timestamp: new Date(),
        priority: log.includes("❌") ? "critical" : log.includes("🤖") ? "high" : "normal",
      }))

      setMessages((prev) => [...prev, ...newMessages])
      setProcessedAuditLogCount(auditLogs.length)
    }
  }, [auditLogs, processedAuditLogCount])

  // Handle system action messages from dashboard
  useEffect(() => {
    if (systemActionMessage) {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        sender: "system",
        content: `[SYSTEM] ${systemActionMessage.message}`,
        timestamp: new Date(),
        priority:
          systemActionMessage.type === "error"
            ? "critical"
            : systemActionMessage.type === "warning"
              ? "high"
              : "normal",
      }
      setMessages((prev) => [...prev, systemMessage])
    }
  }, [systemActionMessage])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim()
    if (!content) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsElizaProcessing(true)
    onStatusChange("SCANNING")

    try {
      // Get AI response
      const auditLogsSummary = auditLogs.slice(-5).join("; ")
      const aiResponse = await getElizaAIResponse({
        userMessage: content,
        elizaStatus,
        currentStep,
        aiRecommendedAction,
        auditLogsSummary,
      })

      // Add Eliza response
      const elizaMessage: Message = {
        id: `eliza-${Date.now()}`,
        sender: "eliza",
        content: aiResponse.responseText,
        timestamp: new Date(),
        priority: "normal",
      }
      setMessages((prev) => [...prev, elizaMessage])

      // Trigger action if specified
      if (aiResponse.actionToTrigger) {
        setTimeout(() => {
          onTriggerAction(aiResponse.actionToTrigger!)
        }, 1000)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: "eliza",
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        priority: "high",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsElizaProcessing(false)
      onStatusChange("ACTIVE")
    }
  }

  const quickActions = [
    { label: "Connect Wallet", action: "Connect Wallet" },
    { label: "Find Yield", action: "Optimize Yield" },
    { label: "Deploy Vault", action: "Activate Anti-Liquidation" },
    { label: "Scan Vault", action: "Scan Vault" },
  ]

  const getStatusColor = () => {
    switch (elizaStatus) {
      case "ACTIVE":
        return "bg-green-500"
      case "SCANNING":
        return "bg-amber-500 animate-pulse"
      case "IDLE":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Simple markdown parser for bold and newlines
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="font-bold text-blue-300">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })
      return (
        <p key={i} className="mb-1">
          {parts}
        </p>
      )
    })
  }

  // Floating Chat Button when minimized
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 hover:scale-110"
        onClick={() => setIsMinimized(false)}
      >
        <div className="relative">
          <Bot className="h-6 w-6 text-white" />
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-blue-500/30 text-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-sm ${
        isMaximized ? "fixed inset-4 h-[calc(100vh-2rem)] w-auto" : "w-[420px] h-[650px]"
      }`}
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)",
      }}
    >
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3 flex justify-between items-center border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor()}`}
            />
          </div>
          <div>
            <span className="font-semibold text-sm text-white">🤖 Eliza AI Assistant</span>
            <div className="text-xs text-blue-300">
              {elizaStatus === "SCANNING" ? "Analyzing..." : elizaStatus === "ACTIVE" ? "Online" : "Idle"}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-slate-600 rounded-lg"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-slate-600 rounded-lg"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Chat Content Area */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="bg-slate-700/50 text-white border-b border-blue-500/20 rounded-none">
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-200"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-200"
            >
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-0 flex flex-col flex-1 min-h-0 m-0">
            <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender !== "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 shadow-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : message.sender === "system"
                              ? `bg-gradient-to-r from-slate-700 to-slate-600 text-gray-100 ${
                                  message.priority === "critical"
                                    ? "border-l-4 border-red-500"
                                    : message.priority === "high"
                                      ? "border-l-4 border-amber-500"
                                      : ""
                                }`
                              : "bg-gradient-to-r from-slate-700 to-slate-600 text-gray-100"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isElizaProcessing && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl p-3 shadow-lg">
                        <div className="flex space-x-1">
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
              </ScrollArea>
            </div>

            {/* Premium Quick Actions */}
            <div className="p-4 border-t border-blue-500/20 bg-slate-800/50">
              <p className="text-xs text-gray-400 mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => onTriggerAction(action.action)}
                    className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-200 hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 hover:text-blue-100 text-xs py-2 rounded-lg shadow-sm transition-all duration-200"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-0 flex flex-col flex-1 min-h-0 m-0">
            <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`text-sm rounded-lg p-3 shadow-sm ${
                          log.includes("❌")
                            ? "bg-gradient-to-r from-red-900/50 to-red-800/50 text-red-200 border-l-4 border-red-500"
                            : log.includes("🤖")
                              ? "bg-gradient-to-r from-amber-900/50 to-amber-800/50 text-amber-200 border-l-4 border-amber-500"
                              : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-gray-200"
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic text-center py-8">No audit logs yet.</div>
                  )}
                  <div ref={auditLogsEndRef} />
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {/* Premium Input */}
        <div className="p-4 border-t border-blue-500/20 bg-slate-800/50 flex-shrink-0">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about DeFi..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isElizaProcessing}
              className="flex-1 bg-slate-700/50 border-blue-500/30 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isElizaProcessing || !inputMessage.trim()}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-lg px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
