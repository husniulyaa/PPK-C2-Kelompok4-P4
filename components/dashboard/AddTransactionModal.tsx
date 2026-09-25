"use client";

import { useState } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Calendar, Tag, FileText } from "lucide-react";
import { TransactionType } from "@/lib/types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/utils";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: TransactionType;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  initialType = "expense",
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(
    initialType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a transaction title");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: numAmount,
          type,
          category,
          date: new Date(date).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add transaction");
      }

      // Reset form
      setTitle("");
      setAmount("");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b191a]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#F3E8DF] dark:bg-[#3b2324] border border-[#E8D1C5] dark:border-[#57595B] shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8D1C5] dark:border-[#57595B]/60">
          <div>
            <h3 className="text-base font-bold text-[#452829] dark:text-[#F3E8DF]">
              {type === "income" ? "Add Income Transaction" : "Add Expense Transaction"}
            </h3>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">
              Record a new student cashflow entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#57595B] hover:text-[#452829] dark:text-[#E8D1C5]/70 dark:hover:text-[#F3E8DF] hover:bg-[#E8D1C5]/40 dark:hover:bg-[#452829]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle Tabs (US-05 & US-06) */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#E8D1C5]/50 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B]/50 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                type === "income"
                  ? "bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm"
                  : "text-[#57595B] dark:text-[#E8D1C5]/70 hover:text-[#452829] dark:hover:text-[#F3E8DF]"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income (+US-05)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                type === "expense"
                  ? "bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm"
                  : "text-[#57595B] dark:text-[#E8D1C5]/70 hover:text-[#452829] dark:hover:text-[#F3E8DF]"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Expense (-US-06)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-[#9c3c3a]/15 border border-[#9c3c3a]/30 text-[#9c3c3a] dark:text-[#c46461]">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1.5">
              Title / Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
              <input
                type="text"
                placeholder={type === "income" ? "e.g. Monthly Allowance from parents" : "e.g. Campus Lunch & Coffee"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF] placeholder-[#57595B]/60"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1.5">
              Amount (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#57595B]">
                Rp
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1.5">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B] pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Select transaction category"
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF] cursor-pointer font-medium"
              >
                {currentCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1.5">
              Transaction Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF]"
              />
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] hover:bg-[#E8D1C5]/30 dark:hover:bg-[#452829] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-[#F3E8DF] dark:text-[#452829] bg-[#452829] hover:bg-[#5c3638] dark:bg-[#E8D1C5] dark:hover:bg-[#dfc1b3] rounded-xl shadow-sm transition-all active:scale-95"
            >
              {loading ? "Saving..." : `Add ${type === "income" ? "Income" : "Expense"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
