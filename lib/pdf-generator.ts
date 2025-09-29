import jsPDF from "jspdf"
import type { Category, Package } from "@/app/page"

interface InvoiceData {
  category: Category
  package: Package
  customerInfo: {
    name: string
    email: string
    phone: string
    date: string
    notes?: string
  }
}

export async function generatePDFInvoice(data: InvoiceData) {
  const { category, package: selectedPackage, customerInfo } = data

  // Create new PDF document
  const doc = new jsPDF()

  // Set up colors
  const primaryColor = [21, 128, 61] // Green-700
  const accentColor = [132, 204, 22] // Bright green
  const textColor = [55, 65, 81] // Gray-700
  const lightGray = [243, 244, 246] // Gray-100

  // Generate unique invoice number
  const invoiceNumber = `LXS-${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Header Section
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")

  // Studio Logo (Camera icon representation)
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 10, 20, 20, "F")
  doc.setFontSize(16)
  doc.setTextColor(21, 128, 61)
  doc.text("📷", 22, 23)

  // Studio Name and Details
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("Luxe Studio", 45, 20)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Professional Photography Services", 45, 27)
  doc.text("123 Photography Lane, Creative District, Mumbai 400001", 45, 32)
  doc.text("Phone: +91 98765 43210 | Email: hello@luxestudio.com", 45, 37)

  // Invoice Title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("INVOICE", 15, 60)

  // Invoice Details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Invoice Number: ${invoiceNumber}`, 15, 70)
  doc.text(`Date: ${currentDate}`, 15, 76)
  doc.text(`Booking Date: ${new Date(customerInfo.date).toLocaleDateString("en-IN")}`, 15, 82)

  // Customer Information Section
  doc.setFillColor(...lightGray)
  doc.rect(15, 95, 180, 35, "F")

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("BILL TO:", 20, 105)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(customerInfo.name, 20, 113)
  doc.text(customerInfo.email, 20, 119)
  doc.text(customerInfo.phone, 20, 125)

  // Service Details Section
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICE DETAILS", 15, 150)

  // Service table header
  doc.setFillColor(...primaryColor)
  doc.rect(15, 160, 180, 10, "F")

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("Description", 20, 167)
  doc.text("Package", 120, 167)
  doc.text("Amount", 170, 167)

  // Service details
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 170, 180, 15, "F")

  doc.setTextColor(...textColor)
  doc.setFont("helvetica", "normal")
  doc.text(category.name, 20, 177)
  doc.text(selectedPackage.name, 120, 177)
  doc.text(`₹${selectedPackage.price.toLocaleString()}`, 170, 177)

  // Package features
  let yPosition = 195
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Package Includes:", 20, yPosition)

  yPosition += 8
  doc.setFont("helvetica", "normal")
  selectedPackage.features.forEach((feature) => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(`• ${feature}`, 25, yPosition)
    yPosition += 6
  })

  // Additional notes if provided
  if (customerInfo.notes && customerInfo.notes.trim()) {
    yPosition += 10
    if (yPosition > 260) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFont("helvetica", "bold")
    doc.text("Additional Notes:", 20, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "normal")
    const notes = doc.splitTextToSize(customerInfo.notes, 170)
    doc.text(notes, 20, yPosition)
    yPosition += notes.length * 6
  }

  // Total Section
  yPosition += 20
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFillColor(...accentColor)
  doc.rect(120, yPosition, 75, 25, "F")

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("TOTAL AMOUNT", 125, yPosition + 10)
  doc.setFontSize(16)
  doc.text(`₹${selectedPackage.price.toLocaleString()}`, 125, yPosition + 20)

  // Footer
  const footerY = yPosition + 40
  if (footerY > 270) {
    doc.addPage()
    yPosition = 20
  } else {
    yPosition = footerY
  }

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textColor)
  doc.text("Terms & Conditions:", 15, yPosition)
  doc.text("• 50% advance payment required to confirm booking", 15, yPosition + 6)
  doc.text("• Remaining balance due on the day of shoot", 15, yPosition + 12)
  doc.text("• Cancellation must be made 48 hours in advance", 15, yPosition + 18)
  doc.text("• All edited photos will be delivered within 7-14 business days", 15, yPosition + 24)

  doc.setTextColor(...primaryColor)
  doc.text("Thank you for choosing Luxe Studio for your photography needs!", 15, yPosition + 35)

  // Save the PDF
  const fileName = `Luxe_Studio_Invoice_${invoiceNumber}.pdf`
  doc.save(fileName)

  return {
    invoiceNumber,
    fileName,
    success: true,
  }
}
