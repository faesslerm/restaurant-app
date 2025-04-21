export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: "starters" | "mains" | "desserts" | "drinks"
}

export type CartItem = MenuItem & {
  quantity: number
}
