import jsPDF from "jspdf"
import type { SelectedService, ClientInfo } from "@/lib/types"

interface InvoiceData {
  clientInfo: ClientInfo
  selectedServices: SelectedService[]
  totalAmount: number
}

export async function generateSreePixInvoice(data: InvoiceData) {
  const { clientInfo, selectedServices, totalAmount } = data

  const pdf = new jsPDF()

  // Set font
  pdf.setFont("helvetica")

  // Header - Company Logo and Details
  pdf.setFontSize(24)
  pdf.setTextColor(219, 39, 119) // Pink color
  pdf.text("SREE PIX", 20, 25)

  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text("Photography & Event management", 20, 35)
  pdf.text("Namakkal & Chennai", 20, 42)

  pdf.setFontSize(10)
  pdf.text("MOBILE NO: 9789226868, 8903868682", 20, 52)
  pdf.text("EMAIL: sreepixnkl@gmail.com", 20, 58)

  // Client Information
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text("Client Details:", 20, 75)

  pdf.setFontSize(11)
  pdf.text(`Groom and Bride name: ${clientInfo.groomName} & ${clientInfo.brideName}`, 20, 85)

  let yPos = 95
  if (clientInfo.urudhiDate) {
    pdf.text(`Urudhi - ${new Date(clientInfo.urudhiDate).toLocaleDateString("en-GB")} (Morning)`, 20, yPos)
    yPos += 7
  }
  if (clientInfo.ennaiSeerDate) {
    pdf.text(`Ennai Seer - ${new Date(clientInfo.ennaiSeerDate).toLocaleDateString("en-GB")} (Afternoon)`, 20, yPos)
    yPos += 7
  }
  if (clientInfo.receptionDate) {
    pdf.text(`Reception - ${new Date(clientInfo.receptionDate).toLocaleDateString("en-GB")} (Evening)`, 20, yPos)
    yPos += 7
  }
  if (clientInfo.weddingDate) {
    pdf.text(`Wedding - ${new Date(clientInfo.weddingDate).toLocaleDateString("en-GB")} (Morning)`, 20, yPos)
    yPos += 7
  }

  pdf.text(`Phone: ${clientInfo.phone}`, 20, yPos)
  yPos += 7
  pdf.text(`Email: ${clientInfo.email}`, 20, yPos)
  yPos += 7
  pdf.text(`Address: ${clientInfo.address}`, 20, yPos)
  yPos += 15

  // Services Table Header
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 170, 10, "F")

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.text("S.No", 25, yPos + 7)
  pdf.text("Description", 45, yPos + 7)
  pdf.text("Qty", 130, yPos + 7)
  pdf.text("Rate", 145, yPos + 7)
  pdf.text("Amount", 165, yPos + 7)

  yPos += 15

  // Services Table Content
  selectedServices.forEach((service, index) => {
    if (yPos > 250) {
      pdf.addPage()
      yPos = 20
    }

    pdf.setFontSize(9)
    pdf.text((index + 1).toString(), 25, yPos)

    // Handle long descriptions
    const description = service.description
    if (description.length > 60) {
      const lines = pdf.splitTextToSize(description, 80)
      pdf.text(lines, 45, yPos)
      yPos += (lines.length - 1) * 5
    } else {
      pdf.text(description, 45, yPos)
    }

    pdf.text(service.quantity.toString(), 130, yPos)
    pdf.text(service.rate.toLocaleString(), 145, yPos)
    pdf.text(service.amount.toLocaleString(), 165, yPos)

    yPos += 12
  })

  // Total
  yPos += 10
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 170, 10, "F")

  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text("Total estimate amount", 45, yPos + 7)
  pdf.text(`₹${totalAmount.toLocaleString()}`, 165, yPos + 7)

  // Payment Details
  yPos += 20
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text("Payment Details:", 20, yPos)

  yPos += 10
  pdf.setFontSize(11)
  pdf.text(`Payment Type: ${clientInfo.paymentType === "advance" ? "Advance Payment" : "Full Payment"}`, 20, yPos)
  yPos += 7
  pdf.text(`Payment Method: ${clientInfo.paymentMethod?.toUpperCase()}`, 20, yPos)
  yPos += 7
  pdf.text(`Amount Paid: ₹${clientInfo.amountPaid?.toLocaleString() || "0"}`, 20, yPos)

  if (clientInfo.paymentType === "advance" && clientInfo.amountPaid) {
    const balanceDue = totalAmount - clientInfo.amountPaid
    yPos += 7
    pdf.setTextColor(220, 38, 127) // Pink color for balance
    pdf.text(`Balance Due: ₹${balanceDue.toLocaleString()}`, 20, yPos)
    pdf.setTextColor(0, 0, 0) // Reset to black
  }

  // Advance amount note
  if (clientInfo.paymentType === "advance") {
    yPos += 15
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Note: Balance amount to be paid before the event date.", 20, yPos)
    pdf.setTextColor(0, 0, 0)
  }

  // Footer
  yPos += 15
  pdf.setFontSize(10)
  pdf.text("Thank you for choosing SREE PIX!", 20, yPos)
  pdf.text(`Invoice generated on: ${new Date().toLocaleDateString("en-GB")}`, 20, yPos + 10)

  // Save the PDF
  const fileName = `SREE_PIX_Invoice_${clientInfo.groomName}_${clientInfo.brideName}_${new Date().toISOString().split("T")[0]}.pdf`
  pdf.save(fileName)
}
