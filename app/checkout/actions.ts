"use server"

import type { CartItem } from "@/types/menu"

type PaymentData = {
  amount: number
  amountPerPerson?: number
  numberOfPeople?: number
  items: CartItem[]
  splitBill?: boolean
}

export async function processPayment(data: PaymentData) {
  // In a real app, this would integrate with Stripe
  // For demo purposes, we'll just simulate a successful payment

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a transaction ID
  const transactionId = `TX-${Date.now()}`

  // Store payment details for success page
  // In a real app, this would be stored in a database
  const paymentDetails = {
    transactionId,
    amount: data.amount,
    splitBill: data.splitBill || false,
    amountPerPerson: data.amountPerPerson,
    numberOfPeople: data.numberOfPeople,
    timestamp: new Date().toISOString(),
  }

  // Store in session storage for demo purposes
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("lastPayment", JSON.stringify(paymentDetails))
  }

  return {
    success: true,
    transactionId,
    splitBill: data.splitBill,
    amountPerPerson: data.amountPerPerson,
    numberOfPeople: data.numberOfPeople,
  }
}
