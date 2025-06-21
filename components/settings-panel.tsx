"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Shield, Activity, TrendingUp, Target, Bell, Save, RefreshCw, CheckCircle } from "lucide-react"
import { supabaseSimulator, type UserSettings } from "@/lib/supabase-integration"

export function SettingsPanel() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const userSettings = await supabaseSimulator.getUserSettings("user-123")
      setSettings(userSettings)
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setIsSaving(true)
      await supabaseSimulator.updateUserSettings("user-123", settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Failed to load settings</p>
            <Button onClick={loadSettings} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {/* Module Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Module Controls</span>
          </CardTitle>
          <CardDescription>Enable or disable individual protection modules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base font-medium">Oracle Bot</Label>
                <p className="text-sm text-muted-foreground">Automated price monitoring and alerts</p>
              </div>
            </div>
            <Switch
              checked={settings.oracleBotEnabled}
              onCheckedChange={(checked) => updateSetting("oracleBotEnabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <Label className="text-base font-medium">MEV Protector</Label>
                <p className="text-sm text-muted-foreground">Protection against MEV attacks and frontrunning</p>
              </div>
            </div>
            <Switch
              checked={settings.mevProtectorEnabled}
              onCheckedChange={(checked) => updateSetting("mevProtectorEnabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <Label className="text-base font-medium">Liquidation Guard</Label>
                <p className="text-sm text-muted-foreground">
                  Automatic collateral management and liquidation prevention
                </p>
              </div>
            </div>
            <Switch
              checked={settings.liquidationGuardEnabled}
              onCheckedChange={(checked) => updateSetting("liquidationGuardEnabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base font-medium">Yield Switcher</Label>
                <p className="text-sm text-muted-foreground">Automatic yield optimization and strategy switching</p>
              </div>
            </div>
            <Switch
              checked={settings.yieldSwitcherEnabled}
              onCheckedChange={(checked) => updateSetting("yieldSwitcherEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Management</CardTitle>
          <CardDescription>Configure risk thresholds and safety parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Liquidation Threshold</Label>
              <Badge variant="outline">{settings.liquidationThreshold}%</Badge>
            </div>
            <Slider
              value={[settings.liquidationThreshold]}
              onValueChange={(value) => updateSetting("liquidationThreshold", value[0])}
              max={95}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative (50%)</span>
              <span>Aggressive (95%)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">LTV ratio at which liquidation protection will trigger</p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Maximum Risk Score</Label>
              <Badge variant="outline">{settings.maxRiskScore}/10</Badge>
            </div>
            <Slider
              value={[settings.maxRiskScore]}
              onValueChange={(value) => updateSetting("maxRiskScore", value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low Risk (1)</span>
              <span>High Risk (10)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Maximum risk level for yield strategies</p>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Configure automatic actions and behaviors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Auto-Rebalance</Label>
              <p className="text-sm text-muted-foreground">
                Automatically rebalance positions when thresholds are reached
              </p>
            </div>
            <Switch
              checked={settings.autoRebalanceEnabled}
              onCheckedChange={(checked) => updateSetting("autoRebalanceEnabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for important events and actions</p>
              </div>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
