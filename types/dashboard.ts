// types/dashboard.ts
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface User {
  id: number
  name: {
    firstname: string
    lastname: string
  }
  email: string
}
