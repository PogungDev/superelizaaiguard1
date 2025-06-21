"use client"

import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function ActionButton({ label, onClick, disabled = false }: ActionButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  )
}
