"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { OwnerLogin } from "@/components/owner-login"
import { ServiceSelection } from "@/components/service-selection"
import { ClientForm } from "@/components/client-form"
import { AdminPanel } from "@/components/admin-panel"
import type { ServiceItem, SelectedService } from "@/lib/types"

export default function OwnerPage() {
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false)
  const [currentStep, setCurrentStep] = useState<"services" | "client" | "admin">("services")
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch("/api/services", { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to load services")
        const servicesData = await response.json()
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (error) {
        console.error("Failed to load services:", error)
        // Fallback to empty array if JSON fails to load
        setServices([])
      }
    }

    loadServices()
  }, [])

  const handleOwnerLogin = () => {
    setIsOwnerLoggedIn(true)
  }

  const handleServicesSelected = (services: SelectedService[]) => {
    setSelectedServices(services)
    setCurrentStep("client")
  }

  const handleBackToServices = () => {
    setCurrentStep("services")
  }

  const handleGoToAdmin = () => {
    setCurrentStep("admin")
  }

  const handleBackFromAdmin = () => {
    setCurrentStep("services")
  }

  const handleServicesUpdate = (updatedServices: ServiceItem[]) => {
    setServices(updatedServices)
  }

  if (!isOwnerLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <OwnerLogin onLogin={handleOwnerLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {currentStep === "services" && (
          <ServiceSelection services={services} onNext={handleServicesSelected} onGoToAdmin={handleGoToAdmin} />
        )}

        {currentStep === "client" && <ClientForm selectedServices={selectedServices} onBack={handleBackToServices} />}

        {currentStep === "admin" && (
          <AdminPanel services={services} onServicesUpdate={handleServicesUpdate} onBack={handleBackFromAdmin} />
        )}
      </main>
    </div>
  )
}
