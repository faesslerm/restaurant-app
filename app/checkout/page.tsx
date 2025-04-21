"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Users } from "lucide-react"
import { useActiveOrder } from "@/hooks/use-active-order"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { processPayment } from "./actions"

export default function CheckoutPage() {
  const router = useRouter()
  const { orderItems, getOrderTotal, clearOrder, tableNumber } = useActiveOrder()
  const [isClient, setIsClient] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitBill, setSplitBill] = useState(false)
  const [numberOfPeople, setNumberOfPeople] = useState(2)

  const totalAmount = getOrderTotal()
  const amountPerPerson = splitBill ? totalAmount / numberOfPeople : totalAmount

  // Check if user is authenticated and has items
  useEffect(() => {
    setIsClient(true)
    const authCode = localStorage.getItem("authCode")
    if (!authCode) {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    if (isClient && orderItems.length === 0) {
      router.push("/menu")
    }
  }, [isClient, orderItems, router])

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Store order items for receipt
      sessionStorage.setItem("lastOrder", JSON.stringify(orderItems))

      // In a real app, this would integrate with Stripe
      await processPayment({
        amount: totalAmount,
        amountPerPerson: splitBill ? amountPerPerson : undefined,
        numberOfPeople: splitBill ? numberOfPeople : undefined,
        items: orderItems,
        splitBill,
      })

      // Store payment details for success page
      const paymentDetails = {
        transactionId: `TX-${Date.now()}`,
        amount: totalAmount,
        splitBill,
        amountPerPerson: splitBill ? amountPerPerson : undefined,
        numberOfPeople: splitBill ? numberOfPeople : undefined,
        timestamp: new Date().toISOString(),
      }
      sessionStorage.setItem("lastPayment", JSON.stringify(paymentDetails))

      // Clear the active order after successful payment
      clearOrder()
      localStorage.removeItem("orderStartTime")

      // Redirect to success page
      router.push("/checkout/success")
    } catch (error) {
      console.error("Payment failed:", error)
      setIsProcessing(false)
    }
  }

  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value >= 2) {
      setNumberOfPeople(value)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Link href="/bill" className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to bill
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your payment to finish your order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Split the Bill</h3>
              </div>
              <Switch checked={splitBill} onCheckedChange={setSplitBill} aria-label="Toggle bill splitting" />
            </div>

            {splitBill && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="numberOfPeople">Number of people</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min="2"
                    value={numberOfPeople}
                    onChange={handleNumberOfPeopleChange}
                  />
                </div>

                <div className="bg-amber-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Amount per person:</span>
                    <span>${amountPerPerson.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg mt-2">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
              <h3 className="font-medium">Payment Method</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              In a real application, this would integrate with Stripe to securely process your payment.
            </p>
            <p className="text-xs text-muted-foreground">
              For this demo, clicking "Pay Now" will simulate a successful payment.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing
              ? "Processing..."
              : splitBill
                ? `Pay ${amountPerPerson.toFixed(2)} per person`
                : `Pay ${totalAmount.toFixed(2)}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
