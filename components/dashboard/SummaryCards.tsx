"use client";

import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCurrency, getExpenseStatus } from "@/lib/utils";
import { FinancialStats } from "@/lib/types";

interface SummaryCardsProps {
  stats: FinancialStats;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function SummaryCards({ stats, onAddIncome, onAddExpense }: SummaryCardsProps) {
  const { totalBalance, totalIncome, totalExpense, transactionCount } = stats;

  const statusInfo = getExpenseStatus(totalIncome, totalExpense, totalBalance);
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Current Balance / Saldo (With Status Pengeluaran) */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech hover:shadow-fintechHover transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/70">
              Saldo Keuangan (Balance)
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#E8D1C5]/40 dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] border border-[#E8D1C5] dark:border-[#57595B]/50 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-[#452829] dark:text-[#F3E8DF]">
              {formatCurrency(totalBalance)}
            </div>
            
            {/* Status Saldo Badge: PENGELUARAN BOROS / HEMAT / NORMAL */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border shadow-xs ${statusInfo.badgeClass}`}
              >
                {statusInfo.status === "PENGELUARAN HEMAT" && (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                {statusInfo.status === "PENGELUARAN NORMAL" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#452829] dark:text-[#E8D1C5]" />
                )}
                {statusInfo.status === "PENGELUARAN BOROS" && (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                )}
                <span>{statusInfo.label}</span>
              </span>
              <span className="text-[#57595B] dark:text-[#E8D1C5]/60 text-[11px]">
                • {transactionCount} transaksi
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-[#57595B] dark:text-[#E8D1C5]/75 leading-tight">
              {statusInfo.description}
            </p>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#E8D1C5]/20 dark:bg-[#452829]/30 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Total Income with #E8D1C5 Soft Beige Accent */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech hover:shadow-fintechHover transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/70">
            Total Income
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#E8D1C5] dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] border border-[#E8D1C5] dark:border-[#57595B]/50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-[#452829] dark:text-[#F3E8DF]">
            +{formatCurrency(totalIncome)}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="inline-flex items-center text-xs text-[#3c5943] dark:text-[#E8D1C5] font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              Incoming Funds
            </span>
            <button
              onClick={onAddIncome}
              className="text-xs font-bold text-[#452829] dark:text-[#E8D1C5] hover:underline"
            >
              + Add Income
            </button>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#E8D1C5]/30 dark:bg-[#452829]/40 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 3. Total Expense */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech hover:shadow-fintechHover transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/70">
            Total Expense
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#57595B]/15 dark:bg-[#57595B]/50 text-[#452829] dark:text-[#F3E8DF] border border-[#E8D1C5] dark:border-[#57595B]/50 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-[#9c3c3a] dark:text-[#c46461]">
            -{formatCurrency(totalExpense)}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="inline-flex items-center text-xs text-[#9c3c3a] dark:text-[#c46461] font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              Total Outflow
            </span>
            <button
              onClick={onAddExpense}
              className="text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] hover:underline"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#57595B]/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4. Savings Ratio / Student Health Metric */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech hover:shadow-fintechHover transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/70">
            Savings Ratio
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#E8D1C5]/40 dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] border border-[#E8D1C5] dark:border-[#57595B]/50 flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-[#452829] dark:text-[#F3E8DF]">
            {savingsRate}%
          </div>
          <div className="mt-2.5 w-full bg-[#E8D1C5]/40 dark:bg-[#57595B]/40 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-[#452829] dark:bg-[#E8D1C5] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#E8D1C5]/20 rounded-full blur-xl pointer-events-none" />
      </div>
    </div>
  );
}
