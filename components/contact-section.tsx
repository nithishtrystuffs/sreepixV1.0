import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["9789226868", "8903868682"],
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["sreepixnkl@gmail.com"],
      action: "Send Email",
    },
    {
      icon: MapPin,
      title: "Service Areas",
      details: ["Namakkal", "Chennai"],
      action: "Get Directions",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Sun: 9:00 AM - 9:00 PM", "Available for events 24/7"],
      action: "Book Now",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-[var(--font-playfair)]">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to capture your special moments? Contact us today to discuss your photography and event management
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                  <info.icon className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-lg font-bold text-card-foreground">{info.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  {info.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-card-foreground font-[var(--font-playfair)] mb-4">
                Ready to Book Your Event?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact us today for a personalized quote and let us make your special day unforgettable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Call 9789226868
                </Button>
                <Button size="lg" variant="outline">
                  Send WhatsApp Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
