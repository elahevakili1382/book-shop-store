type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

const items1: CartItem[] = [
  { id: 1, name: 'کتاب A', price: 100000, quantity: 2 },
  { id: 2, name: 'کتاب B', price: 150000, quantity: 1 },
  { id: 3, name: 'کتاب C', price: 80000, quantity: 3 },
]

function getCartCount(items1: CartItem[]) {
  if (!items1 || items1.length === 0) {
    return 0
  }

  return items1.reduce((t:number,i: CartItem) => t + i.quantity, 0)
}

function removeFromCart(items:CartItem[], id: number) {
   return items.filter((item) => item.id !== id )
}
        

