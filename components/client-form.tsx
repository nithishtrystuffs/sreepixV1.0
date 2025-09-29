"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Calendar, Phone, Mail, MapPin, CreditCard, IndianRupee } from "lucide-react"
import { generateSreePixInvoice } from "@/lib/sreepix-pdf-generator"
import { createCalendarEventServer } from "@/lib/google-calendar-server"
import type { SelectedService, ClientInfo } from "@/lib/types"

interface ClientFormProps {
  selectedServices: SelectedService[]
  onBack: () => void
}

export function ClientForm({ selectedServices, onBack }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientInfo>({
    groomName: "",
    brideName: "",
    urudhiDate: "",
    ennaiSeerDate: "",
    receptionDate: "",
    weddingDate: "",
    phone: "",
    email: "",
    address: "",
    paymentType: "advance",
    paymentMethod: "cash",
    advanceAmount: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.groomName.trim()) newErrors.groomName = "Groom name is required"
    if (!formData.brideName.trim()) newErrors.brideName = "Bride name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    if (formData.paymentType === "advance") {
      if (!formData.advanceAmount || formData.advanceAmount <= 0) {
        newErrors.advanceAmount = "Advance amount is required"
      } else if (formData.advanceAmount >= getTotalAmount()) {
        newErrors.advanceAmount = "Advance amount cannot be equal to or greater than total amount"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await generateSreePixInvoice({
        clientInfo: formData,
        selectedServices,
        totalAmount: getTotalAmount(),
      })

      const eventDates = [
        { date: formData.urudhiDate, type: "Urudhi Ceremony" },
        { date: formData.ennaiSeerDate, type: "Ennai Seer Ceremony" },
        { date: formData.receptionDate, type: "Reception" },
        { date: formData.weddingDate, type: "Wedding Ceremony" },
      ].filter((event) => event.date) // Only include dates that are filled

      const calendarPromises = eventDates.map((event) =>
        createCalendarEventServer({
          customerName: `${formData.groomName} & ${formData.brideName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          eventDate: event.date,
          eventType: event.type,
          services: selectedServices.map((s) => `${s.description} (${s.quantity}x)`),
          totalAmount: getTotalAmount(),
          notes: `Address: ${formData.address}`,
        }),
      )

      const calendarResults = await Promise.allSettled(calendarPromises)
      const successfulEvents = calendarResults.filter(
        (result) => result.status === "fulfilled" && result.value.success,
      ).length

      console.log(`[v0] Created ${successfulEvents}/${eventDates.length} calendar events`)

      alert(
        "Invoice generated successfully! The PDF has been downloaded." +
          (successfulEvents > 0 ? ` ${successfulEvents} calendar reminder(s) created.` : ""),
      )

      // Reset form
      setFormData({
        groomName: "",
        brideName: "",
        urudhiDate: "",
        ennaiSeerDate: "",
        receptionDate: "",
        weddingDate: "",
        phone: "",
        email: "",
        address: "",
        paymentType: "advance",
        paymentMethod: "cash",
        advanceAmount: 0,
      })

      onBack()
    } catch (error) {
      console.error("Error generating invoice:", error)
      alert("Error generating invoice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ClientInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + service.amount, 0)
  }

  const getBalanceAmount = () => {
    if (formData.paymentType === "full") return 0
    return getTotalAmount() - (formData.advanceAmount || 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[var(--font-playfair)]">
          Client Information
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Enter client details to generate the professional invoice
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <User className="h-5 w-5" />
                Client Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Groom Name *</Label>
                    <Input
                      id="groomName"
                      value={formData.groomName}
                      onChange={(e) => handleInputChange("groomName", e.target.value)}
                      placeholder="Enter groom's name"
                      className={errors.groomName ? "border-destructive" : ""}
                    />
                    {errors.groomName && <p className="text-sm text-destructive">{errors.groomName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brideName">Bride Name *</Label>
                    <Input
                      id="brideName"
                      value={formData.brideName}
                      onChange={(e) => handleInputChange("brideName", e.target.value)}
                      placeholder="Enter bride's name"
                      className={errors.brideName ? "border-destructive" : ""}
                    />
                    {errors.brideName && <p className="text-sm text-destructive">{errors.brideName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urudhiDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Urudhi Date
                    </Label>
                    <Input
                      id="urudhiDate"
                      type="date"
                      value={formData.urudhiDate}
                      onChange={(e) => handleInputChange("urudhiDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ennaiSeerDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ennai Seer Date
                    </Label>
                    <Input
                      id="ennaiSeerDate"
                      type="date"
                      value={formData.ennaiSeerDate}
                      onChange={(e) => handleInputChange("ennaiSeerDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receptionDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Reception Date
                    </Label>
                    <Input
                      id="receptionDate"
                      type="date"
                      value={formData.receptionDate}
                      onChange={(e) => handleInputChange("receptionDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weddingDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Wedding Date
                    </Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => handleInputChange("weddingDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>

                <Card className="bg-muted/50 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground text-lg">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentType">Payment Type *</Label>
                        <Select
                          value={formData.paymentType}
                          onValueChange={(value: "advance" | "full") => handleInputChange("paymentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advance">Advance Payment</SelectItem>
                            <SelectItem value="full">Full Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <Select
                          value={formData.paymentMethod}
                          onValueChange={(value: "cash" | "upi") => handleInputChange("paymentMethod", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.paymentType === "advance" && (
                      <div className="space-y-2">
                        <Label htmlFor="advanceAmount" className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          Advance Amount *
                        </Label>
                        <Input
                          id="advanceAmount"
                          type="number"
                          value={formData.advanceAmount || ""}
                          onChange={(e) => handleInputChange("advanceAmount", Number(e.target.value))}
                          placeholder="Enter advance amount"
                          className={errors.advanceAmount ? "border-destructive" : ""}
                          min="1"
                          max={getTotalAmount() - 1}
                        />
                        {errors.advanceAmount && <p className="text-sm text-destructive">{errors.advanceAmount}</p>}
                        <p className="text-xs text-muted-foreground">
                          Balance Amount: ₹{getBalanceAmount().toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Generating Invoice..." : "Generate Invoice & Download PDF"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle className="text-card-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedServices.map((service) => (
                  <div key={service.id} className="space-y-1">
                    <div className="text-xs text-card-foreground font-medium leading-tight">
                      {service.description.substring(0, 50)}...
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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-card-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-pink-600">₹{getTotalAmount().toLocaleString()}</span>
                </div>

                {formData.paymentType === "advance" && formData.advanceAmount && formData.advanceAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Advance ({formData.paymentMethod.toUpperCase()})</span>
                      <span className="font-medium text-green-600">₹{formData.advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Balance Due</span>
                      <span className="font-medium text-orange-600">₹{getBalanceAmount().toLocaleString()}</span>
                    </div>
                  </>
                )}

                {formData.paymentType === "full" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Payment ({formData.paymentMethod.toUpperCase()})</span>
                    <span className="font-medium text-green-600">₹{getTotalAmount().toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
