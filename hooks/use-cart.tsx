"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { MenuItem, CartItem } from "@/types/menu"

type CartContextType = {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  clearItem: (itemId: string) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearItem: () => {},
  clearCart: () => {},
  getItemQuantity: () => 0,
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize cart from localStorage on client side
  useEffect(() => {
    setIsClient(true)
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isClient])

  const addItem = (item: MenuItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemId)

      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      } else {
        return prevItems.filter((i) => i.id !== itemId)
      }
    })
  }

  const clearItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId))
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemQuantity = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearItem,
        clearCart,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
