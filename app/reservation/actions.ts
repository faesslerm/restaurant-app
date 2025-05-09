"use server";

import { revalidatePath } from "next/cache";
import { generateReservationCode, sendReservationEmail } from "@/lib/email";

type ReservationData = {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone?: string;
};

// Generate a random table number between 1 and 20
function generateTableNumber(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export async function createReservation(data: ReservationData) {
  try {
    // Generate a unique 6-digit code for this reservation
    const reservationCode = generateReservationCode();

    // Assign a random table number
    const tableNumber = generateTableNumber();

    // In a real app, you would save this to your database
    // For example: await db.reservations.create({ ...data, code: reservationCode, tableNumber })

    // Send confirmation email with the code
    await sendReservationEmail({
      to: data.email,
      name: data.name,
      reservationCode,
      date: data.date,
      time: data.time,
      guests: data.guests,
      tableNumber,
    });

    const reservation = {
      ...data,
      code: reservationCode,
      tableNumber,
      id: Date.now().toString(),
    };

    revalidatePath("/reservation");
    return { success: true, reservation: reservation };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    throw new Error("Failed to create reservation");
  }
}
