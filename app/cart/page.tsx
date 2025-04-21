"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash2, Plus, Minus, Receipt } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useActiveOrder } from "@/hooks/use-active-order"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CartPage() {
  const router = useRouter()
  const { items, addItem, removeItem, clearItem, getTotalPrice, clearCart } = useCart()
  const { hasActiveOrder, addToOrder } = useActiveOrder()
  const [isClient, setIsClient] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    setIsClient(true)
    const authCode = localStorage.getItem("authCode")
    if (!authCode) {
      router.push("/auth")
    }
  }, [router])

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) return

    // Add cart items to the active order
    addToOrder(items)

    // Show success message
    toast({
      title: "Order placed successfully!",
      description: "Your order has been sent to the kitchen.",
    })

    // Clear the cart
    clearCart()

    // Redirect to menu
    router.push("/menu")
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Toaster />
        <Link href="/menu" className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to menu
        </Link>

        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/menu")} className="bg-amber-600 hover:bg-amber-700">
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8 pb-24">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <Link href="/menu" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to menu
        </Link>
        {hasActiveOrder && (
          <Button variant="outline" className="flex items-center gap-1" onClick={() => router.push("/bill")}>
            <Receipt className="h-4 w-4" />
            <span>View Bill</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addItem(item)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => clearItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
