"use client";

import { Edit3, Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Tag, AlertCircle } from "lucide-react";
import { TransactionItem } from "@/lib/types";
import { formatCurrency, formatDate, getCategoryBadgeClass } from "@/lib/utils";

interface TransactionTableProps {
  transactions: TransactionItem[];
  onEdit: (transaction: TransactionItem) => void;
  onDelete: (transaction: TransactionItem) => void;
  onAddNew: () => void;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onAddNew,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#57595B]/40 dark:border-[#57595B]/60 bg-[#F3E8DF]/60 dark:bg-[#3b2324]/40 p-12 text-center transition-all">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#E8D1C5] dark:bg-[#452829] text-[#452829] dark:text-[#E8D1C5] flex items-center justify-center mb-3.5 shadow-sm">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[#452829] dark:text-[#F3E8DF]">
          No transactions found
        </h4>
        <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70 mt-1 max-w-sm mx-auto">
          No records match your selected criteria. Add a new income or expense transaction to begin tracking your student finances.
        </p>
        <button
          onClick={onAddNew}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#452829] hover:bg-[#5c3638] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:hover:bg-[#dfc1b3] dark:text-[#452829] text-xs font-bold shadow-sm transition-transform active:scale-95"
        >
          Add First Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 bg-white dark:bg-[#3b2324] shadow-fintech overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8D1C5] dark:border-[#57595B]/60 bg-[#F3E8DF] dark:bg-[#2b191a] text-[11px] uppercase tracking-wider text-[#57595B] dark:text-[#E8D1C5]/80 font-bold">
              <th className="py-3.5 px-4 sm:px-6">Transaction Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8D1C5]/60 dark:divide-[#57595B]/40 text-xs">
            {transactions.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-[#E8D1C5]/20 dark:hover:bg-[#452829]/40 transition-colors group"
                >
                  {/* Title & icon */}
                  <td className="py-4 px-4 sm:px-6 font-medium text-[#452829] dark:text-[#F3E8DF]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          isIncome
                            ? "bg-[#E8D1C5]/50 border-[#E8D1C5] text-[#452829] dark:bg-[#452829] dark:border-[#57595B] dark:text-[#E8D1C5]"
                            : "bg-[#57595B]/15 border-[#57595B]/30 text-[#57595B] dark:bg-[#57595B]/40 dark:border-[#57595B] dark:text-[#F3E8DF]"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <span className="font-bold text-[#452829] dark:text-[#F3E8DF]">
                        {tx.title}
                      </span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-4 text-[#57595B] dark:text-[#E8D1C5]">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryBadgeClass(
                        tx.category
                      )}`}
                    >
                      <Tag className="w-3 h-3" />
                      {tx.category}
                    </span>
                  </td>

                  {/* Type Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                        isIncome
                          ? "bg-[#E8D1C5]/60 text-[#452829] border-[#E8D1C5] dark:bg-[#452829] dark:text-[#E8D1C5] dark:border-[#57595B]"
                          : "bg-[#57595B]/15 text-[#57595B] border-[#57595B]/30 dark:bg-[#57595B]/50 dark:text-[#F3E8DF] dark:border-[#57595B]"
                      }`}
                    >
                      {isIncome ? "Income" : "Expense"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-[#57595B] dark:text-[#E8D1C5]/80 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#57595B]" />
                      {formatDate(tx.date)}
                    </div>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-4 px-4 text-right font-bold whitespace-nowrap ${
                      isIncome
                        ? "text-[#452829] dark:text-[#E8D1C5]"
                        : "text-[#9c3c3a] dark:text-[#c46461]"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(tx)}
                        title="Edit transaction"
                        className="p-1.5 rounded-lg text-[#57595B] hover:text-[#452829] dark:text-[#E8D1C5]/70 dark:hover:text-[#F3E8DF] hover:bg-[#E8D1C5]/40 dark:hover:bg-[#452829]/60 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        title="Delete transaction"
                        className="p-1.5 rounded-lg text-[#57595B] hover:text-[#9c3c3a] dark:text-[#E8D1C5]/70 dark:hover:text-[#c46461] hover:bg-[#9c3c3a]/10 dark:hover:bg-[#9c3c3a]/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
