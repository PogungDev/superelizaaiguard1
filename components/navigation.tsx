"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, Home, Wallet, Menu, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  isWalletConnected: boolean
}

export function Navigation({ currentPage, onPageChange, isWalletConnected }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-vault-border bg-vault-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-vault-primary" />
          <span className="text-xl font-bold text-vault-text">Super Eliza AI Guard</span>
          <Badge className="status-active ml-2">
            <Activity className="h-3 w-3 mr-1" />
            Protected
          </Badge>
        </div>

        {/* Desktop Navigation - Simplified */}
        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className={`text-vault-text hover:text-vault-primary ${
              currentPage === "landing" ? "text-vault-primary font-semibold" : ""
            }`}
            onClick={() => onPageChange("landing")}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            className={`text-vault-text hover:text-vault-primary ${
              currentPage === "dashboard" ? "text-vault-primary font-semibold" : ""
            }`}
            onClick={() => onPageChange("dashboard")}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </nav>

        {/* Wallet Status / Connect Button */}
        <div className="hidden md:block">
          {isWalletConnected ? (
            <Badge className="status-active">
              <Wallet className="h-3 w-3 mr-1" />
              0xAbC...123
            </Badge>
          ) : (
            <Button className="btn-primary">Connect Wallet</Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-vault-text" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-vault-card border-vault-border">
            <DropdownMenuItem onClick={() => onPageChange("landing")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPageChange("dashboard")}>
              <Wallet className="h-4 w-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              {isWalletConnected ? (
                <Badge className="status-active w-full justify-center">
                  <Wallet className="h-3 w-3 mr-1" />
                  0xAbC...123
                </Badge>
              ) : (
                <Button className="btn-primary w-full">Connect Wallet</Button>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
