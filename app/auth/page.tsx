"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { verifyReservationCode } from "./actions"

export default function AuthPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setIsVerifying(true)
    setError("")

    try {
      const result = await verifyReservationCode(code)
      if (result.success) {
        // In a real app, this would set a session or token
        // For demo purposes, we'll store in localStorage
        localStorage.setItem("authCode", code)

        // Store the table number
        if (result.tableNumber) {
          localStorage.setItem("tableNumber", result.tableNumber)
        }

        router.push("/menu") // Redirect directly to menu
      } else {
        setError("Invalid reservation code. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Code</CardTitle>
          <CardDescription>Use the reservation code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Reservation Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your 6-digit code"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isVerifying || !code}>
              {isVerifying ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have a code?{" "}
            <Link href="/reservation" className="text-amber-600 hover:underline">
              Make a reservation
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
