"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { TransactionItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: TransactionItem | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete transaction");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b191a]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#F3E8DF] dark:bg-[#3b2324] border border-[#E8D1C5] dark:border-[#57595B] shadow-2xl overflow-hidden p-5 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#57595B] hover:text-[#452829] dark:text-[#E8D1C5]/70 dark:hover:text-[#F3E8DF] hover:bg-[#E8D1C5]/40 dark:hover:bg-[#452829]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9c3c3a]/15 text-[#9c3c3a] dark:bg-[#9c3c3a]/30 dark:text-[#c46461] border border-[#9c3c3a]/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
              Delete Transaction? (US-09)
            </h3>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-white dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] text-xs">
          <div className="font-bold text-[#452829] dark:text-[#F3E8DF]">
            {transaction.title}
          </div>
          <div className="flex justify-between text-[#57595B] dark:text-[#E8D1C5]/70 mt-1 font-medium">
            <span>{transaction.category}</span>
            <span
              className={`font-bold ${
                transaction.type === "income" ? "text-[#452829] dark:text-[#E8D1C5]" : "text-[#9c3c3a] dark:text-[#c46461]"
              }`}
            >
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 text-xs rounded-xl bg-[#9c3c3a]/15 text-[#9c3c3a] dark:text-[#c46461] border border-[#9c3c3a]/30">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] hover:bg-[#E8D1C5]/30 dark:hover:bg-[#452829] rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#9c3c3a] hover:bg-[#832e2c] text-[#F3E8DF] rounded-xl shadow-sm transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
