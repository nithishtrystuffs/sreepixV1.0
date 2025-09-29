interface CalendarEvent {
  summary: string
  description: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
  }>
  reminders: {
    useDefault: boolean
    overrides?: Array<{
      method: string
      minutes: number
    }>
  }
}

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

export async function createCalendarEvent(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    // Check if Google Calendar credentials are available
    const clientId = "734100018375-dql0ukgpfpuhdf3bq36upc68064qo5ar.apps.googleusercontent.com"
    const apiKey = "AIzaSyDtjSBzaUj9dZkJBGHnXFMUHb_R1DENdh0"

    if (!clientId || !apiKey) {
      console.warn(
        "Google Calendar credentials not found. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_API_KEY to your environment variables.",
      )
      return false
    }

    // Load Google APIs
    await loadGoogleAPI()

    // Initialize Google Calendar API
    await initializeGoogleCalendar(clientId, apiKey)

    // Create the calendar event
    const event = createEventObject(bookingDetails)

    // Insert the event into the calendar
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    })

    console.log("[v0] Calendar event created successfully:", response.result.htmlLink)
    return true
  } catch (error) {
    console.error("[v0] Error creating calendar event:", error)
    return false
  }
}

function createEventObject(bookingDetails: BookingDetails): CalendarEvent {
  const eventDate = new Date(bookingDetails.eventDate)

  // Set event time (default to 10:00 AM - 6:00 PM for photography sessions)
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

  if (bookingDetails.services && bookingDetails.services.length > 0) {
    description += `Services:\n${bookingDetails.services.map((service) => `• ${service}`).join("\n")}\n`
  }

  description += `Total Amount: ₹${bookingDetails.totalAmount.toLocaleString()}\n`

  if (bookingDetails.notes) {
    description += `\nNotes: ${bookingDetails.notes}`
  }

  return {
    summary: `📸 ${bookingDetails.eventType} - ${bookingDetails.customerName}`,
    description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    attendees: [
      {
        email: bookingDetails.customerEmail,
        displayName: bookingDetails.customerName,
      },
    ],
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

async function loadGoogleAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof gapi !== "undefined") {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = () => {
      gapi.load("client:auth2", resolve)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function initializeGoogleCalendar(clientId: string, apiKey: string): Promise<void> {
  await gapi.client.init({
    apiKey,
    clientId,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar",
  })

  // Check if user is already signed in
  const authInstance = gapi.auth2.getAuthInstance()
  if (!authInstance.isSignedIn.get()) {
    // Sign in the user
    await authInstance.signIn()
  }
}

// Global type declaration for Google API
declare global {
  interface Window {
    gapi: any
  }
  const gapi: any
}
