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
  if (category.includes("Food")) return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  if (category.includes("Tuition") || category.includes("Scholarship")) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  if (category.includes("Housing")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (category.includes("Transportation")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  if (category.includes("Entertainment")) return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  if (category.includes("Allowance") || category.includes("Job")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
}
