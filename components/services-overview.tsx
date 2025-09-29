"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Bone as Drone, Music, Monitor, HardDrive } from "lucide-react"
import { useEffect, useState } from "react"

interface ServiceCategory {
  title: string
  description: string
  icon: string
  color: string
  services: string[]
}

interface Feature {
  icon: string
  title: string
  description: string
}

export function ServicesOverview() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, featuresResponse] = await Promise.all([
          fetch("/service-categories.json"),
          fetch("/features.json"),
        ])

        const categoriesData = await categoriesResponse.json()
        const featuresData = await featuresResponse.json()

        setServiceCategories(categoriesData)
        setFeatures(featuresData)
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [])

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Camera,
      Video,
      Drone,
      Music,
      Monitor,
      HardDrive,
    }
    return icons[iconName] || Camera
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
            Our Services
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-[var(--font-playfair)]">
            Complete Photography & Event Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From traditional ceremonies to modern celebrations, we provide comprehensive photography and event
            management services across Namakkal & Chennai.
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {serviceCategories.map((category, index) => {
            const IconComponent = getIcon(category.icon)
            return (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-pink-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground font-[var(--font-playfair)]">
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                        <span className="text-sm text-card-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon)
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm border border-border"
              >
                <div className="p-2 bg-pink-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
