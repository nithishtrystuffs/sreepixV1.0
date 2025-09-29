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
      console.warn("[v0] Google Calendar credentials not configured", {
        hasEmail: !!clientEmail,
        hasKey: !!privateKey,
        hasCalendarId: !!calendarId,
      })
      return {
        success: false,
        message:
          "Calendar not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and GOOGLE_CALENDAR_ID, and share that calendar with the service account.",
      }
    }

    // Create JWT auth client
    console.log("Email loaded:", !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
    console.log("Private key loaded:", !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
    console.log("Calendar ID loaded:", !!process.env.GOOGLE_CALENDAR_ID)

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    })

    // Force authentication to check validity
    await auth.authorize()
    console.log("✅ Google service account authorized")

    const calendar = google.calendar({ version: "v3", auth })

    // Validate date and build stable IST times to avoid timezone drift
    const isYMD = /^\d{4}-\d{2}-\d{2}$/.test(bookingDetails.eventDate)
    if (!isYMD) {
      return { success: false, message: `Invalid date format: "${bookingDetails.eventDate}". Expected YYYY-MM-DD.` }
    }

    const startISO = `${bookingDetails.eventDate}T10:00:00+05:30`
    const endISO = `${bookingDetails.eventDate}T18:00:00+05:30`

    const event = {
      ...createEventObject(bookingDetails),
      // Override start/end to explicit IST offset
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end: { dateTime: endISO, timeZone: "Asia/Kolkata" },
    }

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
  } catch (error: any) {
    // Improved error surfacing for easier diagnosis
    const status = error?.code || error?.response?.status
    const details = error?.response?.data?.error?.message || error?.message || "Unknown error"
    const helpful =
      status === 403 || status === 404
        ? " Ensure the GOOGLE_CALENDAR_ID is correct and that the calendar is shared with the service account email with 'Make changes to events' permission."
        : ""

    console.error("[v0] Error creating calendar event:", { status, details })
    return {
      success: false,
      message: `Failed to create calendar reminder (${status ?? "no-status"}): ${details}.${helpful}`,
    }
  }
}

function createEventObject(bookingDetails: BookingDetails) {
  let description = `Photography Session Booking\n\n`
  description += `Client: ${bookingDetails.customerName}\n`
  description += `Phone: ${bookingDetails.customerPhone}\n`
  description += `Email: ${bookingDetails.customerEmail}\n`
  description += `Event Type: ${bookingDetails.eventType}\n`

  if (bookingDetails.packageName) {
    description += `Package: ${bookingDetails.packageName}\n`
  }
  if (bookingDetails.services?.length) {
    description += `Services:\n${bookingDetails.services.map((s) => `• ${s}`).join("\n")}\n`
  }
  description += `Total Amount: ₹${bookingDetails.totalAmount.toLocaleString()}\n`
  if (bookingDetails.notes) {
    description += `\nNotes: ${bookingDetails.notes}`
  }

  return {
    summary: `📸 ${bookingDetails.eventType} - ${bookingDetails.customerName}`,
    description,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 day before
        { method: "popup", minutes: 60 }, // 1 hour before
        { method: "email", minutes: 60 }, // 1 hour before
      ],
    },
  }
}
