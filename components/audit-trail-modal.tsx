import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"

interface AuditTrailModalProps {
  isOpen: boolean
  onClose: () => void
  auditLogs: string[] // Simplified for now, can be more detailed
}

export default function AuditTrailModal({ isOpen, onClose, auditLogs }: AuditTrailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] glass-card cyber-border text-vault-text">
        <DialogHeader>
          <DialogTitle className="text-vault-primary text-2xl cyber-text-glow flex items-center gap-2">
            <History className="h-7 w-7 text-neon-primary" /> ELIZA REASONING TRACE
          </DialogTitle>
          <DialogDescription className="text-vault-text-muted">
            DETAILED BREAKDOWN OF ELIZA'S DECISION-MAKING PROCESS.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-4 border border-vault-border rounded-md bg-vault-card/20 font-mono text-sm scrollbar-thin scrollbar-thumb-neon-primary scrollbar-track-vault-card">
          <p className="text-vault-text-muted mb-4">
            {`// Placeholder for detailed reasoning trace.
// This would include:
// - Input data (e.g., Chainlink Price Feeds, Mempool data)
// - AI model inference steps
// - Logic tree evaluation
// - Final decision and confidence score

// Example:
// Timestamp: ${new Date().toLocaleTimeString()}
// Event: LiquidationRiskDetected
// Input Data:
//   - ETH Price: $1800 (Threshold: $1900)
//   - Collateral Value: 0.5 ETH ($900)
//   - Loan Debt: $800
//   - Liquidation Threshold: 85%
// AI Model: RiskAssessmentEngine (GPT-4o)
// Inference:
//   1. Calculate LTV: (Loan Debt / Collateral Value) = (800 / 900) = 0.888 (88.8%)
//   2. Compare LTV to Threshold: 88.8% > 85% -> Liquidation Risk HIGH
//   3. Recommend Action: Activate Anti-Liquidation
// Confidence Score: 99.5%
// Action Triggered: Activate Anti-Liquidation`}
          </p>
          {auditLogs.map((log, index) => (
            <div key={index} className="mb-2 p-2 border-b border-vault-border last:border-b-0">
              <p className="text-neon-primary font-semibold">{log}</p>
              {/* <pre className="text-vault-text-muted text-xs whitespace-pre-wrap mt-1">
                {JSON.stringify(log.details, null, 2)}
              </pre> */}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
