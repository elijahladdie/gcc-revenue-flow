import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Change to your FastAPI base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
