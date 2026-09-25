import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export const INCOME_CATEGORIES = [
  "Allowance / Uang Saku",
  "Scholarship / Beasiswa",
  "Part-time Job",
  "Freelance Work",
  "Academic Award",
  "Family Support",
  "Other Income",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food & Meals / Makan",
  "Tuition & Fees / SPP",
  "Books & Stationery",
  "Housing / Kos-Kosan",
  "Transportation / Bensin",
  "Internet & Mobile Data",
  "Entertainment & Coffee",
  "Healthcare & Medicine",
  "Personal Care & Laundry",
  "Other Expense",
] as const;

export function getCategoryBadgeClass(category: string): string {
  if (category.includes("Food") || category.includes("Coffee")) {
    return "bg-[#E8D1C5]/40 text-[#452829] dark:bg-[#57595B]/50 dark:text-[#F3E8DF] border-[#E8D1C5] dark:border-[#57595B]";
  }
  if (category.includes("Tuition") || category.includes("Scholarship")) {
    return "bg-[#452829]/10 text-[#452829] dark:bg-[#E8D1C5]/20 dark:text-[#E8D1C5] border-[#452829]/20 dark:border-[#E8D1C5]/30";
  }
  if (category.includes("Housing") || category.includes("Rent")) {
    return "bg-[#57595B]/15 text-[#452829] dark:bg-[#57595B]/60 dark:text-[#F3E8DF] border-[#57595B]/30 dark:border-[#57595B]";
  }
  if (category.includes("Allowance") || category.includes("Job") || category.includes("Freelance")) {
    return "bg-[#E8D1C5]/60 text-[#452829] dark:bg-[#452829] dark:text-[#E8D1C5] border-[#E8D1C5] dark:border-[#57595B]";
  }
  if (category.includes("Transportation") || category.includes("Internet")) {
    return "bg-[#F3E8DF] text-[#57595B] dark:bg-[#3b2324] dark:text-[#E8D1C5] border-[#E8D1C5] dark:border-[#57595B]";
  }
  return "bg-[#E8D1C5]/20 text-[#57595B] dark:bg-[#57595B]/30 dark:text-[#F3E8DF] border-[#E8D1C5]/60 dark:border-[#57595B]/60";
}
