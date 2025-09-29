"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Users, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-pink-50 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4 lg:space-y-6">
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200 inline-flex">
                ✨ Professional Photography & Event Management
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground font-[var(--font-playfair)] leading-tight">
                Capturing Your <span className="text-pink-600">Special Moments</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                From traditional ceremonies to modern celebrations, SREE PIX brings professional photography and
                complete event management services to Namakkal & Chennai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-6 sm:px-8">
                Book Your Event
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
                <Play className="h-4 w-4" />
                View Portfolio
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center"
                    >
                      <Star className="h-3 w-3 text-pink-600 fill-current" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">500+ Happy Families</div>
                  <div className="text-muted-foreground">5-star reviews</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-pink-600 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">Professional Service</div>
                  <div className="text-muted-foreground">Complete Event Management</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto lg:max-w-none">
              <img
                src="/elegant-wedding-photography-setup-with-bride-and-g.jpg"
                alt="Professional wedding photography"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-xl sm:text-2xl">1000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Events Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
