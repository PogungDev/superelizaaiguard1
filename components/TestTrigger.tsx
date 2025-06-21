"use client"
interface TestTriggerProps {
  label: string
  onTrigger: () => void
}

export default function TestTrigger({ label, onTrigger }: TestTriggerProps) {
  return (
    <button
      onClick={onTrigger}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
    >
      🔥 {label}
    </button>
  )
}
