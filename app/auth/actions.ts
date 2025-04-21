"use server"

// In a real app, this would verify against your database
export async function verifyReservationCode(code: string) {
  try {
    // For demo purposes, we'll accept any 6-digit code
    // In a real app, you would check this against your database
    if (code.length === 6 && /^\d+$/.test(code)) {
      // In a real app, you would retrieve the table number from your database
      // For demo purposes, we'll generate a random table number if one doesn't exist

      // Simulate retrieving reservation data
      const reservations = JSON.parse(sessionStorage.getItem("reservations") || "[]")
      const reservation = reservations.find((r: any) => r.code === code)

      // If we found the reservation, use its table number
      // Otherwise, generate a random one for demo purposes
      const tableNumber = reservation?.tableNumber || Math.floor(Math.random() * 20) + 1

      return {
        success: true,
        tableNumber: tableNumber.toString(),
      }
    }

    return { success: false }
  } catch (error) {
    console.error("Failed to verify code:", error)
    throw new Error("Failed to verify reservation code")
  }
}
