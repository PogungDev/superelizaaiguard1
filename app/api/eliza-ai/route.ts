import { type NextRequest, NextResponse } from "next/server"
import { getElizaAIResponse } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userMessage, elizaStatus, currentStep, aiRecommendedAction, auditLogsSummary } = body

    const result = await getElizaAIResponse({
      userMessage,
      elizaStatus,
      currentStep,
      aiRecommendedAction,
      auditLogsSummary,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in Eliza AI API route:", error)
    return NextResponse.json({ error: "Failed to get Eliza AI response" }, { status: 500 })
  }
}
