import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"

interface ResultNotificationProps {
  isOpen: boolean
  onClose: () => void
  result: string | null
}

export default function ResultNotification({ isOpen, onClose, result }: ResultNotificationProps) {
  const isSuccess = result && !result.includes("Risk") && !result.includes("Error")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card cyber-border text-vault-text text-center">
        <DialogHeader className="flex flex-col items-center">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-vault-success mb-4 cyber-text-glow" />
          ) : (
            <XCircle className="h-16 w-16 text-vault-danger mb-4 cyber-text-glow" />
          )}
          <DialogTitle className="text-2xl font-bold text-vault-primary cyber-text-glow">
            {isSuccess ? "ACTION SUCCESSFUL" : "ACTION ALERT"}
          </DialogTitle>
          <DialogDescription className="text-vault-text-muted text-lg mt-2">
            {result || "No result message."}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
