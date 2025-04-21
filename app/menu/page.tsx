"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Receipt, Table } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useActiveOrder } from "@/hooks/use-active-order"
import type { MenuItem } from "@/types/menu"
import { menuItems } from "@/data/menu-items"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function MenuPage() {
  const router = useRouter()
  const { items, addItem, removeItem, getItemQuantity, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { tableNumber, hasActiveOrder, addToOrder } = useActiveOrder()
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
    if (items.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive",
      })
      return
    }

    // Add cart items to the active order
    addToOrder(items)

    // Set order start time if this is the first order
    if (!hasActiveOrder) {
      localStorage.setItem("orderStartTime", new Date().toISOString())
    }

    // Show success message
    toast({
      title: "Order placed successfully!",
      description: "Your order has been sent to the kitchen.",
    })

    // Clear the cart
    clearCart()
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Our Menu</h1>
          {tableNumber && (
            <div className="flex items-center mt-1">
              <Table className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Table {tableNumber}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {hasActiveOrder && (
            <Button variant="outline" className="flex items-center gap-1" onClick={() => router.push("/bill")}>
              <Receipt className="h-5 w-5" />
              <span className="hidden sm:inline">View Bill</span>
            </Button>
          )}
          <Button variant="outline" className="relative" onClick={() => router.push("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && <Badge className="absolute -top-2 -right-2 bg-amber-600">{getTotalItems()}</Badge>}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="starters">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="starters" className="flex-1">
            Starters
          </TabsTrigger>
          <TabsTrigger value="mains" className="flex-1">
            Mains
          </TabsTrigger>
          <TabsTrigger value="desserts" className="flex-1">
            Desserts
          </TabsTrigger>
          <TabsTrigger value="drinks" className="flex-1">
            Drinks
          </TabsTrigger>
        </TabsList>

        {["starters", "mains", "desserts", "drinks"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handlePlaceOrder}>
              Place Order • ${getTotalPrice().toFixed(2)}
            </Button>
            <Button variant="outline" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onRemove: () => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">${item.price.toFixed(2)}</p>

            {quantity === 0 ? (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 h-8 text-xs border-amber-600 text-amber-600"
                onClick={onAdd}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            ) : (
              <div className="flex items-center justify-end mt-2">
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={onRemove}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-2 text-sm font-medium w-4 text-center">{quantity}</span>
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={onAdd}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
