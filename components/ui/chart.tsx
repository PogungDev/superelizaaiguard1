"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend as ChartLegend } from "recharts"

import { cn } from "@/lib/utils"

// Define types
type ChartData = Record<string, any>
type ChartConfig = Record<string, {
  type?: "line"
  props?: any
  color?: string
}>

// Simple placeholder components for now
const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegendContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
)
ChartLegendContent.displayName = "ChartLegendContent"

interface ChartProps {
  data: ChartData[]
  config: ChartConfig
  lineChartProps?: any
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  xAxisKey?: string
  yAxisKey?: string
  className?: string
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      data,
      config,
      lineChartProps,
      showTooltip = true,
      showLegend = true,
      showGrid = false,
      showXAxis = true,
      showYAxis = true,
      xAxisKey,
      yAxisKey,
      className,
    },
    ref,
  ) => {
    const id = React.useId()

    return (
      <ChartContainer ref={ref} className={cn("min-h-[200px] w-full", className)} id={id}>
        <ResponsiveContainer>
          <LineChart data={data} {...lineChartProps}>
            {showGrid && <CartesianGrid vertical={false} />}
            {showXAxis && <XAxis dataKey={xAxisKey} />}
            {showYAxis && <YAxis dataKey={yAxisKey} />}
            {showTooltip && <ChartTooltip cursor={false} content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {Object.entries(config).map(([key, item]) => {
              if (item.type === "line") {
                return <Line key={key} dataKey={key} stroke={`hsl(var(--chart-${key}))`} dot={false} {...item.props} />
              }
              return null
            })}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  },
)

Chart.displayName = "Chart"

export { Chart }
