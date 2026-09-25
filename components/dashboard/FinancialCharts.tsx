"use client";

import { useMemo } from "react";
import { PieChart, BarChart2 } from "lucide-react";
import { TransactionItem, FinancialStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface FinancialChartsProps {
  stats: FinancialStats;
  transactions: TransactionItem[];
}

export function FinancialCharts({ stats, transactions }: FinancialChartsProps) {
  const { totalIncome, totalExpense } = stats;

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const map = new Map<string, number>();

    for (const tx of expenses) {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    }

    const items = Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return items;
  }, [transactions, totalExpense]);

  const totalFlow = totalIncome + totalExpense;
  const incomePercent = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercent = totalFlow > 0 ? 100 - incomePercent : 50;

  // Refined fintech palette colors
  const categoryColors = [
    "bg-[#452829]",
    "bg-[#57595B]",
    "bg-[#E8D1C5]",
    "bg-[#7a484a]",
    "bg-[#8e9094]",
    "bg-[#b38f82]",
    "bg-[#d4b3a4]",
    "bg-[#3d3e40]",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Cashflow Comparison Chart */}
      <div className="rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D1C5]/70 dark:border-[#57595B]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8D1C5]/40 dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
                Cashflow Ratio
              </h3>
              <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">
                Income vs Expense Balance
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#F3E8DF] dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] border border-[#E8D1C5] dark:border-[#57595B]/60">
            {totalFlow > 0 ? `${incomePercent}% In / ${expensePercent}% Out` : "No Activity"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {/* Dual Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#452829] dark:text-[#E8D1C5]">
                Income ({incomePercent}%)
              </span>
              <span className="text-[#57595B] dark:text-[#F3E8DF]">
                Expense ({expensePercent}%)
              </span>
            </div>
            <div className="h-3.5 w-full bg-[#E8D1C5]/30 dark:bg-[#57595B]/40 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#452829] dark:bg-[#E8D1C5] transition-all duration-700"
                style={{ width: `${incomePercent}%` }}
              />
              <div
                className="h-full bg-[#57595B] dark:bg-[#7a484a] transition-all duration-700"
                style={{ width: `${expensePercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Comparison */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#E8D1C5]/30 dark:bg-[#452829]/60 border border-[#E8D1C5] dark:border-[#57595B]/50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/80">
                Inflow (Total)
              </div>
              <div className="text-base font-bold text-[#452829] dark:text-[#F3E8DF] mt-0.5">
                {formatCurrency(totalIncome)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#57595B]/10 dark:bg-[#57595B]/30 border border-[#57595B]/20 dark:border-[#57595B]/50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/80">
                Outflow (Total)
              </div>
              <div className="text-base font-bold text-[#9c3c3a] dark:text-[#c46461] mt-0.5">
                {formatCurrency(totalExpense)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Expense Category Distribution */}
      <div className="rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] p-5 shadow-fintech">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D1C5]/70 dark:border-[#57595B]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8D1C5]/40 dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
                Spending by Category
              </h3>
              <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">
                Top Student Outflow Sources
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#57595B] dark:text-[#E8D1C5]/70">
            {categoryBreakdown.length} Categories
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {categoryBreakdown.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#57595B] dark:text-[#E8D1C5]/60">
              No expense transactions recorded yet. Add your daily expenses to visualize categories.
            </div>
          ) : (
            categoryBreakdown.slice(0, 4).map((item, idx) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        categoryColors[idx % categoryColors.length]
                      }`}
                    />
                    <span className="font-semibold text-[#452829] dark:text-[#F3E8DF] truncate max-w-[150px] sm:max-w-[200px]">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-[#57595B] dark:text-[#E8D1C5]/70 text-[11px]">{item.percentage}%</span>
                    <span className="text-[#452829] dark:text-[#F3E8DF]">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#E8D1C5]/30 dark:bg-[#57595B]/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      categoryColors[idx % categoryColors.length]
                    }`}
                    style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
