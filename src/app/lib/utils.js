import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return 'N/A';
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
  }
  return phoneNumber;
}
