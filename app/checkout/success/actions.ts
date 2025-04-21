"use server"

type ReceiptData = {
  email: string
  transactionId: string
  amount: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  splitBill?: boolean
  amountPerPerson?: number
  numberOfPeople?: number
  date: string
  tableNumber?: string
}

export async function sendReceiptEmail(data: ReceiptData) {
  try {
    // In a real app, this would use an email service like Resend, SendGrid, etc.
    console.log("Sending receipt to:", data.email)
    console.log("Receipt data:", data)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { success: true }
  } catch (error) {
    console.error("Failed to send receipt:", error)
    return { success: false, error: "Failed to send receipt" }
  }
}
