"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Camera, Palette, Clock, Award, Users } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Emotional Storytelling",
    description:
      "We don't just capture images – we preserve the emotions, the laughter, the tears of joy, and the love that makes your story unique.",
  },
  {
    icon: Camera,
    title: "Professional Equipment",
    description:
      "State-of-the-art cameras, lenses, and lighting equipment ensure every shot is technically perfect and artistically beautiful.",
  },
  {
    icon: Palette,
    title: "Artistic Vision",
    description:
      "Our creative approach transforms ordinary moments into extraordinary art pieces that you'll treasure forever.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We understand your excitement to see your photos. Quick turnaround times without compromising on quality.",
  },
  {
    icon: Award,
    title: "Award-Winning Team",
    description:
      "Recognized excellence in photography with multiple awards and certifications from industry professionals.",
  },
  {
    icon: Users,
    title: "Personal Experience",
    description:
      "Every client receives personalized attention and a customized approach tailored to their unique vision and style.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Why Zero Gravity Studio
          </Badge>
          <h2 className="text-4xl font-bold text-foreground font-[var(--font-playfair)]">
            We Take Our Craft Seriously
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Photography is more than just clicking pictures. It's about understanding emotions, capturing fleeting
            moments, and creating timeless memories that tell your unique story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-600 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground font-[var(--font-playfair)]">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 space-y-6">
          <div className="bg-emerald-50 p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground font-[var(--font-playfair)] mb-4">Our Promise to You</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every photograph we create is a piece of art that captures not just how you looked, but how you felt. We
              promise to deliver images that will make you relive those precious moments every time you see them.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
