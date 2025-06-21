"use client"
interface ToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <label className="font-medium text-gray-700">Status:</label>
      <button
        className={`px-3 py-1 rounded text-white font-semibold transition-colors duration-200 ${
          enabled ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
        }`}
        onClick={() => onToggle(!enabled)}
      >
        {enabled ? "🟢 ON" : "🔘 OFF"}
      </button>
    </div>
  )
}
