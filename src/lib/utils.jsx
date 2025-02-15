// utils/classNames.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to combine and merge Tailwind CSS class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
