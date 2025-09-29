"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ExternalLink, Info, CheckCircle } from "lucide-react"

export function GoogleCalendarSetup() {
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "error">("unknown")

  const testConnection = async () => {
    setTestingConnection(true)
    try {
      // Test the server action to see if credentials are configured
      const response = await fetch("/api/test-calendar", { method: "POST" })
      const result = await response.json()
      setConnectionStatus(result.success ? "success" : "error")
    } catch (error) {
      setConnectionStatus("error")
    } finally {
      setTestingConnection(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Google Calendar integration uses server-side authentication for security. Configure your service account
            credentials in the environment variables.
          </AlertDescription>
        </Alert>

        {connectionStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Google Calendar integration is configured and working correctly. New bookings will automatically create
              calendar events.
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Google Calendar integration is not configured or has errors. Please check your environment variables.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-sm">Required Environment Variables:</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs">GOOGLE_SERVICE_ACCOUNT_EMAIL</code>
              <span>- Service account email address</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs">GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code>
              <span>- Service account private key</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs">GOOGLE_CALENDAR_ID</code>
              <span>- Calendar ID (optional, defaults to primary)</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-sm">Setup Instructions:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Go to the Google Cloud Console</li>
            <li>Create a new project or select an existing one</li>
            <li>Enable the Google Calendar API</li>
            <li>Create a Service Account (not OAuth credentials)</li>
            <li>Generate a JSON key for the service account</li>
            <li>Share your Google Calendar with the service account email</li>
            <li>Add the credentials to your Vercel environment variables</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={testingConnection} variant="default" size="sm">
            {testingConnection ? "Testing..." : "Test Connection"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://console.cloud.google.com/", "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Google Cloud Console
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
