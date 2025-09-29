"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/app/page"

interface CategorySelectionProps {
  categories: Category[]
  onSelect: (category: Category) => void
}

export function CategorySelection({ categories, onSelect }: CategorySelectionProps) {
  return (
    <div className="space-y-8 py-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground font-[var(--font-playfair)] text-balance">
          Choose Your Story
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Every moment deserves to be captured with artistry and emotion. Select the photography experience that
          resonates with your story, and let us transform your precious moments into timeless memories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border-border bg-card hover:scale-105"
            onClick={() => onSelect(category)}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-card-foreground font-[var(--font-playfair)]">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                    ₹{category.packages[0].price.toLocaleString()}+
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {category.packages.length} packages
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="group-hover:bg-emerald-600 group-hover:text-white transition-colors bg-emerald-100 text-emerald-800"
                  variant="ghost"
                >
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-emerald-50 px-6 py-3 rounded-full">
          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
          <span>Professional equipment, expert editing, and lifetime memories included in all packages</span>
        </div>
      </div>
    </div>
  )
}
