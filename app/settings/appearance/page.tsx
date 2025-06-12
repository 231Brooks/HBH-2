"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { 
  ArrowLeft, 
  Palette, 
  Monitor, 
  Sun, 
  Moon,
  Eye,
  Type,
  Layout,
  Zap,
  Code,
  CheckCircle,
  AlertTriangle,
  Paintbrush,
  Settings
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

function AppearanceSettingsContent() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Appearance settings state
  const [theme, setTheme] = useState("system") // light, dark, system
  const [colorScheme, setColorScheme] = useState("blue") // blue, green, purple, orange
  const [fontSize, setFontSize] = useState([16]) // 14-20px
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [customCssEnabled, setCustomCssEnabled] = useState(false)

  // Layout preferences
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true)
  const [showTooltips, setShowTooltips] = useState(true)
  const [cardStyle, setCardStyle] = useState("default") // default, minimal, bordered

  const colorSchemes = [
    { id: "blue", name: "Blue", color: "bg-blue-500" },
    { id: "green", name: "Green", color: "bg-green-500" },
    { id: "purple", name: "Purple", color: "bg-purple-500" },
    { id: "orange", name: "Orange", color: "bg-orange-500" },
    { id: "red", name: "Red", color: "bg-red-500" },
    { id: "pink", name: "Pink", color: "bg-pink-500" }
  ]

  const cardStyles = [
    { id: "default", name: "Default", description: "Standard card design with shadows" },
    { id: "minimal", name: "Minimal", description: "Clean design with subtle borders" },
    { id: "bordered", name: "Bordered", description: "Prominent borders and spacing" }
  ]

  const handleSaveSettings = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock API call - in real app, this would save to backend and apply changes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Apply theme changes (mock)
      document.documentElement.style.fontSize = `${fontSize[0]}px`
      
      setSuccess("Appearance settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save appearance settings. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    setTheme("system")
    setColorScheme("blue")
    setFontSize([16])
    setCompactMode(false)
    setAnimations(true)
    setHighContrast(false)
    setCustomCssEnabled(false)
    setSidebarCollapsed(false)
    setShowBreadcrumbs(true)
    setShowTooltips(true)
    setCardStyle("default")
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Appearance Settings</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your interface
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Colors
              </CardTitle>
              <CardDescription>Choose your preferred theme and color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme Mode</Label>
                <RadioGroup value={theme} onValueChange={setTheme}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                        <Sun className="h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                        <Moon className="h-4 w-4" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                        <Monitor className="h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Color Scheme */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Color Scheme</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setColorScheme(scheme.id)}
                      className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                        colorScheme === scheme.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                      <span className="text-sm font-medium">{scheme.name}</span>
                      {colorScheme === scheme.id && (
                        <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography & Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography & Layout
              </CardTitle>
              <CardDescription>Adjust text size and layout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Badge variant="outline">{fontSize[0]}px</Badge>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={20}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small (12px)</span>
                  <span>Large (20px)</span>
                </div>
              </div>

              {/* Layout Options */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Breadcrumbs</Label>
                    <p className="text-xs text-muted-foreground">Navigation breadcrumbs</p>
                  </div>
                  <Switch checked={showBreadcrumbs} onCheckedChange={setShowBreadcrumbs} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Tooltips</Label>
                    <p className="text-xs text-muted-foreground">Helpful hover tooltips</p>
                  </div>
                  <Switch checked={showTooltips} onCheckedChange={setShowTooltips} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sidebar Collapsed</Label>
                    <p className="text-xs text-muted-foreground">Start with collapsed sidebar</p>
                  </div>
                  <Switch checked={sidebarCollapsed} onCheckedChange={setSidebarCollapsed} />
                </div>
              </div>

              {/* Card Style */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Card Style</Label>
                <RadioGroup value={cardStyle} onValueChange={setCardStyle}>
                  <div className="space-y-2">
                    {cardStyles.map((style) => (
                      <div key={style.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={style.id} id={style.id} />
                        <div className="flex-1">
                          <Label htmlFor={style.id} className="cursor-pointer font-medium">
                            {style.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility & Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Accessibility & Performance
              </CardTitle>
              <CardDescription>Settings for better accessibility and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animations</Label>
                    <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Custom Styling
              </CardTitle>
              <CardDescription>Advanced customization options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Custom CSS</Label>
                  <p className="text-xs text-muted-foreground">Allow custom CSS modifications</p>
                </div>
                <Switch checked={customCssEnabled} onCheckedChange={setCustomCssEnabled} />
              </div>

              {customCssEnabled && (
                <div className="border-t pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/profile/theme-editor">
                      <Paintbrush className="h-4 w-4 mr-2" />
                      Open Theme Editor
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use the theme editor to create custom CSS styles for your interface.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleResetToDefaults}>
              <Settings className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? "Saving..." : "Save Appearance Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppearanceSettingsPage() {
  return (
    <ProtectedRoute>
      <AppearanceSettingsContent />
    </ProtectedRoute>
  )
}
