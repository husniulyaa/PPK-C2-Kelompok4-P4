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

export type ExpenseStatus = "PENGELUARAN HEMAT" | "PENGELUARAN NORMAL" | "PENGELUARAN BOROS";

export interface ExpenseStatusInfo {
  status: ExpenseStatus;
  label: string;
  description: string;
  badgeClass: string;
  badgeBorder: string;
  ratio: number;
}

export function getExpenseStatus(
  totalIncome: number,
  totalExpense: number,
  totalBalance: number
): ExpenseStatusInfo {
  // Scenario 1: User has recorded income
  if (totalIncome > 0) {
    const ratio = Math.round((totalExpense / totalIncome) * 100);

    // Defisit atau pengeluaran > 80% pemasukan -> BOROS
    if (totalBalance < 0 || ratio > 80) {
      return {
        status: "PENGELUARAN BOROS",
        label: "PENGELUARAN BOROS",
        description: `Pengeluaran ${ratio}% dari pemasukan (>80% atau saldo defisit). Perlu evaluasi pengeluaran & segera berhemat!`,
        badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700",
        badgeBorder: "border-rose-400",
        ratio,
      };
    }

    // Pengeluaran <= 50% pemasukan -> HEMAT
    if (ratio <= 50) {
      return {
        status: "PENGELUARAN HEMAT",
        label: "PENGELUARAN HEMAT",
        description: `Pengeluaran hanya ${ratio}% dari pemasukan (≤50%). Pola belanja sangat hemat & teratur!`,
        badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
        badgeBorder: "border-emerald-400",
        ratio,
      };
    }

    // Pengeluaran 51% - 80% pemasukan -> NORMAL
    return {
      status: "PENGELUARAN NORMAL",
      label: "PENGELUARAN NORMAL",
      description: `Pengeluaran ${ratio}% dari pemasukan (51%-80%). Kondisi keuangan seimbang & dalam batas wajar.`,
      badgeClass: "bg-[#E8D1C5] text-[#452829] dark:bg-[#452829] dark:text-[#E8D1C5] border-[#E8D1C5] dark:border-[#57595B]",
      badgeBorder: "border-[#452829]",
      ratio,
    };
  }

  // Scenario 2: No income recorded yet, but there is expense -> BOROS (Defisit kas)
  if (totalExpense > 0) {
    return {
      status: "PENGELUARAN BOROS",
      label: "PENGELUARAN BOROS",
      description: "Terdapat pengeluaran tanpa adanya pemasukan tercatat (defisit kas). Segera tambahkan pemasukan!",
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700",
      badgeBorder: "border-rose-400",
      ratio: 100,
    };
  }

  // Scenario 3: Initial state (both income & expense = 0) -> NORMAL
  return {
    status: "PENGELUARAN NORMAL",
    label: "PENGELUARAN NORMAL",
    description: "Belum ada transaksi pengeluaran. Saldo masih aman dan stabil.",
    badgeClass: "bg-[#E8D1C5] text-[#452829] dark:bg-[#452829] dark:text-[#E8D1C5] border-[#E8D1C5] dark:border-[#57595B]",
    badgeBorder: "border-[#452829]",
    ratio: 0,
  };
}

