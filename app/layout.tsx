import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { PWAInstall } from "@/components/pwa-install"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SREE PIX - Photography & Event Management",
  description:
    "Professional photography and event management services in Namakkal & Chennai. Specializing in weddings, portraits, and special events.",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["photography", "wedding photography", "event management", "Namakkal", "Chennai", "SREE PIX"],
  authors: [{ name: "SREE PIX" }],
  creator: "SREE PIX",
  publisher: "SREE PIX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sreepix.vercel.app"),
  openGraph: {
    title: "SREE PIX - Photography & Event Management",
    description: "Professional photography and event management services in Namakkal & Chennai",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SREE PIX - Photography & Event Management",
    description: "Professional photography and event management services in Namakkal & Chennai",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SREE PIX",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SREE PIX" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.jpg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <PWAInstall />
      </body>
    </html>
  )
}
