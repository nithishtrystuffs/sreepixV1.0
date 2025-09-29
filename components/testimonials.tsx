"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Priya & Arjun",
    event: "Wedding Photography",
    image: "/elegant-wedding-photography-setup-with-bride-and-g.jpg",
    rating: 5,
    text: "Zero Gravity Studio didn't just capture our wedding – they captured our souls. Every photograph tells the story of our love in the most beautiful way. The team's attention to detail and ability to make us feel comfortable was incredible.",
    highlight: "They captured our souls",
  },
  {
    name: "Meera Sharma",
    event: "Baby Photoshoot",
    image: "/adorable-newborn-baby-photography-session-with-sof.jpg",
    rating: 5,
    text: "The patience and care they showed with our newborn was extraordinary. These photos will be treasured for generations. They turned our little one's first moments into pure art.",
    highlight: "Turned moments into pure art",
  },
  {
    name: "Rajesh & Kavya",
    event: "Couple Session",
    image: "/romantic-couple-photography-session-outdoors.jpg",
    rating: 5,
    text: "We were nervous about being photographed, but the team made us feel like movie stars. The way they captured our connection and chemistry was magical. These photos show us how others see our love.",
    highlight: "Made us feel like movie stars",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Client Stories
          </Badge>
          <h2 className="text-4xl font-bold text-foreground font-[var(--font-playfair)]">
            Love Stories in Their Own Words
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every couple has a unique story. Here's what some of our families have shared about their experience with
            us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="h-8 w-8 text-emerald-200 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground leading-relaxed pl-6">"{testimonial.text}"</p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.event}</div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800">"{testimonial.highlight}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Join hundreds of happy families who chose Zero Gravity Studio for their special moments
          </p>
        </div>
      </div>
    </section>
  )
}
