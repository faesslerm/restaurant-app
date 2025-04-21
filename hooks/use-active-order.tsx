"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { CartItem } from "@/types/menu"

type ActiveOrderContextType = {
  tableNumber: string | null
  orderItems: CartItem[]
  addToOrder: (items: CartItem[]) => void
  clearOrder: () => void
  getOrderTotal: () => number
  hasActiveOrder: boolean
}

const ActiveOrderContext = createContext<ActiveOrderContextType>({
  tableNumber: null,
  orderItems: [],
  addToOrder: () => {},
  clearOrder: () => {},
  getOrderTotal: () => 0,
  hasActiveOrder: false,
})

export function ActiveOrderProvider({ children }: { children: React.ReactNode }) {
  const [tableNumber, setTableNumber] = useState<string | null>(null)
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize from localStorage on client side
  useEffect(() => {
    setIsClient(true)
    const storedTableNumber = localStorage.getItem("tableNumber")
    const storedOrderItems = localStorage.getItem("activeOrder")

    if (storedTableNumber) {
      setTableNumber(storedTableNumber)
    }

    if (storedOrderItems) {
      try {
        setOrderItems(JSON.parse(storedOrderItems))
      } catch (e) {
        console.error("Failed to parse active order from localStorage")
      }
    }
  }, [])

  // Update localStorage when order changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("activeOrder", JSON.stringify(orderItems))
    }
  }, [orderItems, isClient])

  const addToOrder = (items: CartItem[]) => {
    setOrderItems((prevItems) => {
      const newItems = [...prevItems]

      items.forEach((item) => {
        const existingItemIndex = newItems.findIndex((i) => i.id === item.id)

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity,
          }
        } else {
          // Add new item
          newItems.push({ ...item })
        }
      })

      return newItems
    })
  }

  const clearOrder = () => {
    setOrderItems([])
    // We don't clear the table number here as it's tied to the reservation code
    // It will be cleared when the user signs out
  }

  const getOrderTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <ActiveOrderContext.Provider
      value={{
        tableNumber,
        orderItems,
        addToOrder,
        clearOrder,
        getOrderTotal,
        hasActiveOrder: orderItems.length > 0,
      }}
    >
      {children}
    </ActiveOrderContext.Provider>
  )
}

export const useActiveOrder = () => useContext(ActiveOrderContext)
