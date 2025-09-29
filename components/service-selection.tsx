"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, Settings } from "lucide-react"
import type { ServiceItem, SelectedService } from "@/lib/types"

interface ServiceSelectionProps {
  services: ServiceItem[]
  onNext: (selectedServices: SelectedService[]) => void
  onGoToAdmin?: () => void // Added optional admin navigation prop
}

export function ServiceSelection({ services, onNext, onGoToAdmin }: ServiceSelectionProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId))
      return
    }

    const service = services.find((s) => s.id === serviceId)
    if (!service) return

    const amount = quantity * service.rate

    setSelectedServices((prev) => {
      const existing = prev.find((s) => s.id === serviceId)
      if (existing) {
        return prev.map((s) => (s.id === serviceId ? { ...s, quantity, amount } : s))
      } else {
        return [...prev, { ...service, quantity, amount }]
      }
    })
  }

  const getQuantity = (serviceId: string) => {
    return selectedServices.find((s) => s.id === serviceId)?.quantity || 0
  }

  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + service.amount, 0)
  }

  const handleNext = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service")
      return
    }
    onNext(selectedServices)
  }

  const groupedServices = {
    urudhi: services.filter((s) => s.category === "urudhi"),
    ennai_seer_reception_wedding: services.filter((s) => s.category === "ennai_seer_reception_wedding"),
    post_wedding: services.filter((s) => s.category === "post_wedding"),
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[var(--font-playfair)]">
              Select Photography Services
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 mt-4">
              Choose the services you need for your event. Quantities and prices will be calculated automatically.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            {onGoToAdmin && (
              <Button onClick={onGoToAdmin} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Admin Panel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        <div className="xl:col-span-3 space-y-6 lg:space-y-8">
          {/* Urudhi Services */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground text-lg">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Urudhi
                </Badge>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedServices.urudhi.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground text-sm leading-tight">{service.description}</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      {service.unit} • ₹{service.rate.toLocaleString()} per unit
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) - 1)}
                        disabled={getQuantity(service.id) === 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={getQuantity(service.id)}
                        onChange={(e) => updateQuantity(service.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20 text-center h-8"
                        min="0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="min-w-[80px] text-right">
                      <span className="font-semibold text-sm">
                        ₹{(getQuantity(service.id) * service.rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ennai Seer, Reception & Wedding Services */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground text-lg">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Ennai Seer, Reception & Wedding
                </Badge>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedServices.ennai_seer_reception_wedding.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground text-sm leading-tight">{service.description}</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      {service.unit} • ₹{service.rate.toLocaleString()} per unit
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) - 1)}
                        disabled={getQuantity(service.id) === 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={getQuantity(service.id)}
                        onChange={(e) => updateQuantity(service.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20 text-center h-8"
                        min="0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="min-w-[80px] text-right">
                      <span className="font-semibold text-sm">
                        ₹{(getQuantity(service.id) * service.rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Post Wedding Services */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground text-lg">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Post Wedding
                </Badge>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedServices.post_wedding.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground text-sm leading-tight">{service.description}</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      {service.unit} • ₹{service.rate.toLocaleString()} per unit
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) - 1)}
                        disabled={getQuantity(service.id) === 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={getQuantity(service.id)}
                        onChange={(e) => updateQuantity(service.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20 text-center h-8"
                        min="0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(service.id, getQuantity(service.id) + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="min-w-[80px] text-right">
                      <span className="font-semibold text-sm">
                        ₹{(getQuantity(service.id) * service.rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="xl:col-span-1">
          <Card className="bg-card border-border xl:sticky xl:top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServices.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No services selected</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-card-foreground font-medium leading-tight">
                            {service.description.substring(0, 40)}...
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {service.quantity} × ₹{service.rate.toLocaleString()}
                          </span>
                          <span className="font-semibold">₹{service.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-card-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-pink-600">₹{getTotalAmount().toLocaleString()}</span>
                  </div>

                  <Button onClick={handleNext} className="w-full bg-pink-600 hover:bg-pink-700" size="lg">
                    Continue to Client Details
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
