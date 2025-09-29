"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Star } from "lucide-react"
import type { Category, Package } from "@/app/page"

interface PackageSelectionProps {
  category: Category
  onSelect: (pkg: Package) => void
  onBack: () => void
}

export function PackageSelection({ category, onSelect, onBack }: PackageSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-2">
            {category.name}
          </Badge>
          <h2 className="text-4xl font-bold text-foreground font-[var(--font-playfair)] text-balance">
            Choose Your Perfect Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {category.packages.map((pkg, index) => (
          <Card
            key={pkg.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              pkg.popular
                ? "border-primary shadow-md scale-105 bg-card"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Most Popular
                </div>
              </div>
            )}

            <CardHeader className={`text-center space-y-4 ${pkg.popular ? "pt-12" : "pt-6"}`}>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-card-foreground font-[var(--font-playfair)]">{pkg.name}</h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-sm text-card-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelect(pkg)}
                className={`w-full ${
                  pkg.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
                size="lg"
              >
                Select {pkg.name} Package
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <span>All packages include professional editing and online gallery access</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Need something custom? Contact us for personalized packages tailored to your specific requirements.
        </p>
      </div>
    </div>
  )
}
