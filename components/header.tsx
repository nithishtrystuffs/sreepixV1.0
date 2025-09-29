"use client"

import { Camera, Phone, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  const handleCallClick = () => {
    window.location.href = "tel:+919789226868"
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0" onClick={closeMobileMenu}>
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground font-[var(--font-playfair)] leading-tight">
                SREE PIX
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm leading-tight">Photography & Event Management</p>
              <p className="text-muted-foreground text-xs leading-tight">Namakkal & Chennai</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="/" className="text-foreground hover:text-pink-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="#services" className="text-foreground hover:text-pink-600 transition-colors font-medium">
              Services
            </Link>
            <Link href="#about" className="text-foreground hover:text-pink-600 transition-colors font-medium">
              About
            </Link>
            <Link href="#contact" className="text-foreground hover:text-pink-600 transition-colors font-medium">
              Contact
            </Link>
            <Link href="/owner" className="text-foreground hover:text-pink-600 transition-colors font-medium">
              Owner
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div className="hidden xl:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">9789226868, 8903868682</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">sreepixnkl@gmail.com</span>
              </div>
            </div>
            <Button size="sm" className="bg-pink-600 hover:bg-pink-700 whitespace-nowrap" onClick={handleCallClick}>
              Call Now
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden flex-shrink-0 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 pt-4">
              <Link
                href="/"
                className="text-foreground hover:text-pink-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="#services"
                className="text-foreground hover:text-pink-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link
                href="#about"
                className="text-foreground hover:text-pink-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-foreground hover:text-pink-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                href="/owner"
                className="text-foreground hover:text-pink-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Owner Portal
              </Link>

              <div className="flex flex-col gap-3 pt-3 mt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>9789226868, 8903868682</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>sreepixnkl@gmail.com</span>
                </div>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700 w-fit mt-2" onClick={handleCallClick}>
                  Call Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
