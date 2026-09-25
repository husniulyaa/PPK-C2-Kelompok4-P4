"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AddTransactionModal,
} from "@/components/dashboard/AddTransactionModal";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { FinancialStats, TransactionItem, TransactionType } from "@/lib/types";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/transactions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      setTransactions(data.transactions ?? []);

      setStats({
        totalBalance: data.stats?.totalBalance ?? 0,
        totalIncome: data.stats?.totalIncome ?? 0,
        totalExpense: data.stats?.totalExpense ?? 0,
        transactionCount: data.stats?.transactionCount ?? 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const openTransactionModal = (type: TransactionType) => {
    setTransactionType(type);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F3E8DF] dark:bg-[#2b191a]">
        <p className="text-sm font-semibold text-[#57595B] dark:text-[#E8D1C5]">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3E8DF] dark:bg-[#2b191a]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#452829] dark:text-[#F3E8DF]">
            Financial Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#57595B] dark:text-[#E8D1C5]/70">
            Track your income, expenses, and financial status.
          </p>
        </div>

        <div className="space-y-6">
          <SummaryCards
            stats={stats}
            onAddIncome={() => openTransactionModal("income")}
            onAddExpense={() => openTransactionModal("expense")}
          />

          <FinancialCharts
            stats={stats}
            transactions={transactions}
          />
        </div>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchTransactions}
        initialType={transactionType}
      />
    </main>
  );
}