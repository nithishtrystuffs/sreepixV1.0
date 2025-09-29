"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

interface OwnerLoginProps {
  onLogin: () => void
}

export function OwnerLogin({ onLogin }: OwnerLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simple password check - in real app, use proper authentication
    if (password === "sreepix2024") {
      onLogin()
    } else {
      setError("Invalid password")
    }

    setIsLoading(false)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground font-[var(--font-playfair)]">
                Owner Access
              </CardTitle>
              <p className="text-muted-foreground">Enter password to access service selection system</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="Enter owner password"
                    className={error ? "border-destructive" : ""}
                    disabled={isLoading}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" size="lg" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Access System"}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">Demo password: sreepix2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
