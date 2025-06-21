"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, type LineChartProps, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Define a type for the chart data
type ChartData = Record<string, any>

interface ChartProps extends React.ComponentProps<typeof ChartContainer> {
  data: ChartData[]
  config: ChartConfig
  lineChartProps?: Omit<LineChartProps, "data">
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  xAxisKey?: string
  yAxisKey?: string
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
      ...props
    },
    ref,
  ) => {
    const id = React.useId()

    return (
      <ChartContainer ref={ref} config={config} className={cn("min-h-[200px] w-full", className)} id={id} {...props}>
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
