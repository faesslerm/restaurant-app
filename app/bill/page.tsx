"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Receipt, PlusCircle, Clock, Table } from "lucide-react"
import { useActiveOrder } from "@/hooks/use-active-order"
import { formatDistanceToNow } from "date-fns"

export default function BillPage() {
  const router = useRouter()
  const { tableNumber, orderItems, getOrderTotal, hasActiveOrder } = useActiveOrder()
  const [isClient, setIsClient] = useState(false)
  const [orderTime, setOrderTime] = useState<Date | null>(null)

  // Check if user is authenticated and has an active order
  useEffect(() => {
    setIsClient(true)
    const authCode = localStorage.getItem("authCode")
    if (!authCode) {
      router.push("/auth")
    } else if (!hasActiveOrder) {
      router.push("/menu")
    }

    // Get order time from localStorage
    const storedOrderTime = localStorage.getItem("orderStartTime")
    if (storedOrderTime) {
      setOrderTime(new Date(storedOrderTime))
    } else {
      // If no order time exists, set it now
      const now = new Date()
      localStorage.setItem("orderStartTime", now.toISOString())
      setOrderTime(now)
    }
  }, [router, hasActiveOrder])

  if (!isClient || !hasActiveOrder) {
    return null // Prevent hydration mismatch or redirect if no active order
  }

  // Group items by category for better organization
  const groupedItems = orderItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof orderItems>,
  )

  // Sort categories in a logical order
  const sortedCategories = ["starters", "mains", "desserts", "drinks"]

  return (
    <div className="container max-w-md mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <Link href="/menu" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to menu
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {orderTime && <span>Started {formatDistanceToNow(orderTime, { addSuffix: true })}</span>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Bill</CardTitle>
              <CardDescription className="flex items-center">
                <Table className="h-4 w-4 mr-1" />
                Table {tableNumber}
              </CardDescription>
            </div>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedCategories.map(
            (category) =>
              groupedItems[category] && (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium capitalize">{category}</h3>
                  {groupedItems[category].map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ),
          )}

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${getOrderTotal().toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href="/checkout">Pay Bill</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/menu" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Order More Items
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
