"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

interface ProgressStepsProps {
  currentStep: number
  steps: {
    id: number
    title: string
    description: string
    completed: boolean
  }[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <Card className="w-full shadow-lg bg-card border border-vault-border shadow-neon-glow">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-center text-neon-primary mb-6">YOUR VAULTGUARD JOURNEY</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4 flex-1">
              <div className="flex flex-col items-center text-center min-w-0 flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 ${
                    step.completed
                      ? "bg-neon-accent border-neon-accent text-vault-dark"
                      : currentStep === step.id
                        ? "bg-neon-primary border-neon-primary text-vault-dark animate-pulse"
                        : "bg-transparent border-vault-border text-vault-text"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </div>
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    step.completed
                      ? "text-neon-accent"
                      : currentStep === step.id
                        ? "text-neon-primary"
                        : "text-vault-text/70"
                  }`}
                >
                  {step.title}
                </h4>
                <p className={`text-xs ${currentStep === step.id ? "text-vault-text" : "text-vault-text/50"}`}>
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-vault-border hidden md:block flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
