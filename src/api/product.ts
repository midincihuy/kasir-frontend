import { api } from "./axios"
import type { Product } from "../types/product"

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/produk")
  return res.data
}
