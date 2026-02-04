import axios from "axios"

const baseURL = import.meta.env.VITE_BACKEND_URL

if (!baseURL) {
  throw new Error("VITE_BACKEND_URL is not defined in environment variables")
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})
