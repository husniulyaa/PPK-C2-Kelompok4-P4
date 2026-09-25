"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Calendar, Tag, FileText } from "lucide-react";
import { TransactionItem, TransactionType } from "@/lib/types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/utils";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: TransactionItem | null;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}: EditTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setTitle(transaction.title);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      const parsedDate = new Date(transaction.date);
      setDate(parsedDate.toISOString().split("T")[0]);
      setError(null);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const targetCategories = newType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!(targetCategories as readonly string[]).includes(category)) {
      setCategory(targetCategories[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: numAmount,
          type,
          category,
          date: new Date(date).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update transaction");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b191a]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#F3E8DF] dark:bg-[#3b2324] border border-[#E8D1C5] dark:border-[#57595B] shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8D1C5] dark:border-[#57595B]/60">
          <div>
            <h3 className="text-base font-bold text-[#452829] dark:text-[#F3E8DF]">
              Edit Transaction (US-08)
            </h3>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">
              Update existing transaction details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#57595B] hover:text-[#452829] dark:text-[#E8D1C5]/70 dark:hover:text-[#F3E8DF] hover:bg-[#E8D1C5]/40 dark:hover:bg-[#452829]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type toggle */}
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
              <span>Income</span>
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
              <span>Expense</span>
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
              Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF]"
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
                aria-label="Edit transaction category"
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
              Date
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

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] hover:bg-[#E8D1C5]/30 dark:hover:bg-[#452829] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-[#F3E8DF] dark:text-[#452829] bg-[#452829] hover:bg-[#5c3638] dark:bg-[#E8D1C5] dark:hover:bg-[#dfc1b3] rounded-xl shadow-sm transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
