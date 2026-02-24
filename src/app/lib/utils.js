import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// Checks that value looks like a domain (e.g. beer.com, www.beer.com, https://beer.com/tap-list)
const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i;

export function isValidUrl(value) {
  if (!value) return true; // empty is fine — field is optional
  return URL_PATTERN.test(value.trim());
}

export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return 'N/A';
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
  }
  return phoneNumber;
}
