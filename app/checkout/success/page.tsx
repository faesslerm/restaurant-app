"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Mail } from "lucide-react"
import { ShareBill } from "@/components/share-bill"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendReceiptEmail } from "./actions"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FeedbackForm } from "@/components/feedback-form"

type PaymentDetails = {
  transactionId: string
  amount: number
  splitBill: boolean
  amountPerPerson?: number
  numberOfPeople?: number
  timestamp: string
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  description: string
  category: string
}

export default function SuccessPage() {
  const router = useRouter()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [tableNumber, setTableNumber] = useState<string | null>(null)

  // Check if user is authenticated and get payment details
  useEffect(() => {
    const code = localStorage.getItem("authCode")
    const table = localStorage.getItem("tableNumber")

    if (!code) {
      router.push("/auth")
    } else {
      setAuthCode(code)
      setTableNumber(table)
    }

    // Get payment details from session storage
    try {
      const lastPayment = sessionStorage.getItem("lastPayment")
      const lastOrder = sessionStorage.getItem("lastOrder")

      if (lastPayment) {
        setPaymentDetails(JSON.parse(lastPayment))
      }

      if (lastOrder) {
        setOrderItems(JSON.parse(lastOrder))
      }

      // Try to get user email from localStorage if available
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        setEmail(userEmail)
      }
    } catch (e) {
      console.error("Failed to parse payment details", e)
    }
  }, [router])

  const handleSendReceipt = async () => {
    if (!email || !paymentDetails) return

    setIsSending(true)

    try {
      // Store email for future use
      localStorage.setItem("userEmail", email)

      const result = await sendReceiptEmail({
        email,
        transactionId: paymentDetails.transactionId,
        amount: paymentDetails.amount,
        items: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        splitBill: paymentDetails.splitBill,
        amountPerPerson: paymentDetails.amountPerPerson,
        numberOfPeople: paymentDetails.numberOfPeople,
        date: new Date().toISOString(),
        tableNumber: tableNumber || undefined,
      })

      if (result.success) {
        toast({
          title: "Receipt sent!",
          description: `We've sent your receipt to ${email}`,
        })
        setEmailSent(true)
      } else {
        toast({
          title: "Failed to send receipt",
          description: "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSignOut = () => {
    // Clear all session data
    localStorage.removeItem("authCode")
    localStorage.removeItem("tableNumber") // Clear table assignment
    localStorage.removeItem("activeOrder")
    sessionStorage.removeItem("lastPayment")
    sessionStorage.removeItem("lastOrder")
    sessionStorage.removeItem("orderStartTime")

    router.push("/")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12 pb-24">
      <Toaster />
      <Card className="text-center mb-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>Thank you for your order</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your payment has been processed successfully. You're free to leave the restaurant whenever you're ready.
          </p>

          {tableNumber && (
            <div className="bg-muted p-3 rounded-lg mb-4 text-center">
              <p className="text-sm">
                Table: <span className="font-medium">{tableNumber}</span>
              </p>
            </div>
          )}

          {paymentDetails?.splitBill && paymentDetails.numberOfPeople && paymentDetails.amountPerPerson && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg mb-4 text-left">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-amber-600" />
                  <h3 className="font-medium">Bill Split Details</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    Total amount: <span className="font-medium">${paymentDetails.amount.toFixed(2)}</span>
                  </p>
                  <p>
                    Split between: <span className="font-medium">{paymentDetails.numberOfPeople} people</span>
                  </p>
                  <p>
                    Amount per person: <span className="font-medium">${paymentDetails.amountPerPerson.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <ShareBill
                  amount={paymentDetails.amount}
                  numberOfPeople={paymentDetails.numberOfPeople}
                  amountPerPerson={paymentDetails.amountPerPerson}
                />
              </div>
            </>
          )}

          <div className="bg-muted p-4 rounded-lg text-left mb-6">
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <h3 className="font-medium">Email Receipt</h3>
            </div>

            {!emailSent ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get a copy of your receipt sent to your email for your records.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="receipt-email">Email address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="receipt-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      onClick={handleSendReceipt}
                      disabled={isSending || !email || !paymentDetails}
                      className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
                    >
                      {isSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-green-600">Receipt sent to {email}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href="/menu">Order More Items</Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <FeedbackForm reservationCode={authCode || undefined} />
      </div>
    </div>
  )
}
