// This is a mock implementation for demo purposes
// In a real app, you would use a service like Resend, SendGrid, etc.

type ReservationEmailData = {
  to: string
  name: string
  reservationCode: string
  date: string
  time: string
  guests: number
  tableNumber: number
}

export function generateReservationCode(): string {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendReservationEmail(data: ReservationEmailData): Promise<void> {
  // In a real app, this would send an actual email
  console.log("Sending reservation email to:", data.to)
  console.log("Reservation code:", data.reservationCode)
  console.log("Table number:", data.tableNumber)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return Promise.resolve()
}
