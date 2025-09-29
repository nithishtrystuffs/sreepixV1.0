import { NextResponse } from "next/server"

function checkEnv() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const success = Boolean(email && key)
  return {
    success,
    emailConfigured: Boolean(email),
    keyConfigured: Boolean(key),
    calendarIdConfigured: Boolean(calendarId),
  }
}

export async function POST() {
  const status = checkEnv()
  return NextResponse.json(status, { status: status.success ? 200 : 500 })
}

export async function GET() {
  // Useful for testing in the browser at /api/test-calendar
  const status = checkEnv()
  return NextResponse.json(status, { status: status.success ? 200 : 500 })
}
