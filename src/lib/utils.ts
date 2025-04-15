import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, showSymbol = true): string {
  return new Intl.NumberFormat('ko-KR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
} 