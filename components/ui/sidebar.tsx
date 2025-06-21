"use client"

import * as React from "react"
import { ResizablePanel } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.ComponentProps<typeof ResizablePanel> {
  className?: string
}

const Sidebar = React.forwardRef<React.ElementRef<typeof ResizablePanel>, SidebarProps>(
  ({ className, children, ...props }, ref) => (
    <ResizablePanel ref={ref} className={cn("flex h-full flex-col", className)} {...props}>
      {children}
    </ResizablePanel>
  ),
)

Sidebar.displayName = "Sidebar"

export { Sidebar }
