"use server"

import { revalidatePath } from "next/cache"

type FeedbackData = {
  rating: number
  comment?: string
  reservationCode?: string
  requestStaffHelp?: boolean
  email?: string
}

export async function submitFeedback(data: FeedbackData) {
  try {
    // In a real app, this would save to a database
    console.log("Feedback received:", data)

    // Generate a voucher code for 5-star ratings
    let voucherCode = null
    if (data.rating === 5) {
      voucherCode = generateVoucherCode()
      // In a real app, you would store this voucher in a database
      console.log("Generated voucher code:", voucherCode)
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    revalidatePath("/feedback")
    return { success: true, voucherCode }
  } catch (error) {
    console.error("Failed to submit feedback:", error)
    return { success: false, error: "Failed to submit feedback" }
  }
}

function generateVoucherCode(): string {
  // Generate a random 8-character alphanumeric code
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
