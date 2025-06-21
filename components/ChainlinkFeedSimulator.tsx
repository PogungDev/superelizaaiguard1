"use client"
interface ChainlinkFeedSimulatorProps {
  value: number
  onChange: (value: number) => void
}

export default function ChainlinkFeedSimulator({ value, onChange }: ChainlinkFeedSimulatorProps) {
  return (
    <div className="mt-2 p-4 border rounded-lg bg-gray-50">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        🔗 Simulated Chainlink Price Feed: <span className="font-semibold">${value}</span>
      </label>
      <input
        type="range"
        min="500"
        max="2000"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <p className="text-sm text-gray-500 mt-2">
        (In a real application, this would fetch data from{" "}
        <code className="bg-gray-200 p-1 rounded text-xs">NEXT_PUBLIC_CHAINLINK_API</code>)
      </p>
    </div>
  )
}
