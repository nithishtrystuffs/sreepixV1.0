import { Badge } from "@/components/ui/badge"
import { Award, Users, MapPin, Clock } from "lucide-react"

export function AboutSection() {
  const stats = [
    { icon: Users, number: "1000+", label: "Events Covered" },
    { icon: Award, number: "500+", label: "Happy Families" },
    { icon: MapPin, number: "2", label: "Cities Served" },
    { icon: Clock, number: "5+", label: "Years Experience" },
  ]

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                About SREE PIX
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-[var(--font-playfair)]">
                Professional Photography & Event Management
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                SREE PIX is a premier photography and event management company serving Namakkal and Chennai. We
                specialize in capturing the most precious moments of your life with professional equipment and
                experienced team members.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From traditional Urudhi ceremonies to grand wedding receptions, we provide comprehensive photography,
                videography, and event management services. Our team uses state-of-the-art equipment including Sony FX5
                and FX3 cameras, professional drone technology, and complete LED wall setups.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-card rounded-lg border border-border">
                  <stat.icon className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-card-foreground">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/romantic-couple-photography-session-outdoors.jpg"
                alt="Professional photography session"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="font-bold text-2xl text-pink-600">Professional</div>
                <div className="text-sm text-muted-foreground">Equipment & Team</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
