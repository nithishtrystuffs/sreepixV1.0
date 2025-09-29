import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { join } from "path"
import type { ServiceItem } from "@/lib/types"

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "data", "services.json")
    let services: unknown = []

    try {
      const fileContents = await readFile(filePath, "utf8")
      services = JSON.parse(fileContents)
    } catch (err: any) {
      if (err?.code === "ENOENT") {
        await mkdir(join(process.cwd(), "public", "data"), { recursive: true })
        await writeFile(filePath, "[]", "utf8")
        services = []
      } else {
        throw err
      }
    }

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error reading services:", error)
    return NextResponse.json({ error: "Failed to read services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const services: ServiceItem[] = await request.json()
    const dirPath = join(process.cwd(), "public", "data")
    const filePath = join(dirPath, "services.json")

    // Ensure directory exists before writing
    await mkdir(dirPath, { recursive: true })
    await writeFile(filePath, JSON.stringify(services, null, 2), "utf8")

    return NextResponse.json({ success: true, message: "Services updated successfully" })
  } catch (error) {
    console.error("Error updating services:", error)
    return NextResponse.json({ error: "Failed to update services" }, { status: 500 })
  }
}
