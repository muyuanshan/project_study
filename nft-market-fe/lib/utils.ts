import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
// 合并tailwind的class
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化地址
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};