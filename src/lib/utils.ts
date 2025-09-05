import { clsx, type ClassValue } from "clsx"
import axios from "axios";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Read from environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
