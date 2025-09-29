"use server"

import { google } from "googleapis"

interface BookingDetails {
  customerName: string
  customerEmail: string
  customerPhone: string
  eventDate: string
  eventType: string
  packageName?: string
  services?: string[]
  totalAmount: number
  notes?: string
}

export async function createCalendarEventServer(
  bookingDetails: BookingDetails,
): Promise<{ success: boolean; message: string }> {
  try {
    // Load credentials from env
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n")
    const calendarId = process.env.GOOGLE_CALENDAR_ID

    if (!clientEmail || !privateKey || !calendarId) {
      console.warn("[v0] Google Calendar credentials not configured")
      return {
        success: false,
        message: "Google Calendar integration not configured. Please set up service account credentials.",
      }
    }

    // Create JWT auth client
    console.log("Email loaded:", !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log("Private key loaded:", !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log("Calendar ID loaded:", !!process.env.GOOGLE_CALENDAR_ID);

    const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

    // Force authentication to check validity
    await auth.authorize()
    console.log("✅ Google service account authorized")

    const calendar = google.calendar({ version: "v3", auth })

    // Build event
    const event = createEventObject(bookingDetails)

    // Insert into calendar
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })

    console.log("[v0] Calendar event created successfully:", response.data.htmlLink)
    return {
      success: true,
      message: "Calendar reminder created successfully",
    }
  } catch (error) {
    console.error("[v0] Error creating calendar event:", error)
    return {
      success: false,
      message: "Failed to create calendar reminder",
    }
  }
}

function createEventObject(bookingDetails: BookingDetails) {
  const eventDate = new Date(bookingDetails.eventDate)

  const startTime = new Date(eventDate)
  startTime.setHours(10, 0, 0, 0)

  const endTime = new Date(eventDate)
  endTime.setHours(18, 0, 0, 0)

  let description = `Photography Session Booking\n\n`
  description += `Client: ${bookingDetails.customerName}\n`
  description += `Phone: ${bookingDetails.customerPhone}\n`
  description += `Email: ${bookingDetails.customerEmail}\n`
  description += `Event Type: ${bookingDetails.eventType}\n`

  if (bookingDetails.packageName) {
    description += `Package: ${bookingDetails.packageName}\n`
  }
  if (bookingDetails.services?.length) {
    description += `Services:\n${bookingDetails.services.map(s => `• ${s}`).join("\n")}\n`
  }
  description += `Total Amount: ₹${bookingDetails.totalAmount.toLocaleString()}\n`
  if (bookingDetails.notes) {
    description += `\nNotes: ${bookingDetails.notes}`
  }

  return {
    summary: `📸 ${bookingDetails.eventType} - ${bookingDetails.customerName}`,
    description,
    start: { dateTime: startTime.toISOString(), timeZone: "Asia/Kolkata" },
    end: { dateTime: endTime.toISOString(), timeZone: "Asia/Kolkata" },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 day before
        { method: "popup", minutes: 60 },      // 1 hour before
        { method: "email", minutes: 60 },      // 1 hour before
      ],
    },
  }
}
