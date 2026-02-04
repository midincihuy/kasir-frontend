import { api } from "./axios"

export interface CheckoutItem {
  product_id: number
  quantity: number
}

interface CheckoutPayload {
  items: CheckoutItem[]
}

export const postCheckout = async (items: CheckoutItem[]) => {
    const payload: CheckoutPayload = { items }
    const res = await api.post("/checkout", payload)
    return res.data
}
