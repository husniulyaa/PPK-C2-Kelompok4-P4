"use client";

import { Search, ArrowDownLeft, ArrowUpRight, ListFilter } from "lucide-react";
import { FilterType } from "@/lib/types";

interface TransactionFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (type: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCounts: {
    all: number;
    income: number;
    expense: number;
  };
}

export function TransactionFilters({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCounts,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#3b2324] rounded-2xl border border-[#E8D1C5] dark:border-[#57595B]/60 shadow-fintech">
      {/* US-10: Filter Buttons (All, Income, Expense) with #452829 and #E8D1C5 */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F3E8DF] dark:bg-[#2b191a] border border-[#E8D1C5]/80 dark:border-[#57595B]/60 rounded-xl overflow-x-auto">
        <button
          onClick={() => onFilterChange("all")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            currentFilter === "all"
              ? "bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm"
              : "text-[#57595B] dark:text-[#E8D1C5]/80 hover:text-[#452829] dark:hover:text-[#F3E8DF]"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>All</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8D1C5]/30 dark:bg-[#452829]/50">
            {totalCounts.all}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("income")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            currentFilter === "income"
              ? "bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm"
              : "text-[#57595B] dark:text-[#E8D1C5]/80 hover:text-[#452829] dark:hover:text-[#F3E8DF]"
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Income</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8D1C5]/30 dark:bg-[#452829]/50">
            {totalCounts.income}
          </span>
        </button>

        <button
          onClick={() => onFilterChange("expense")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            currentFilter === "expense"
              ? "bg-[#57595B] text-[#F3E8DF] dark:bg-[#57595B] dark:text-[#F3E8DF] shadow-sm"
              : "text-[#57595B] dark:text-[#E8D1C5]/80 hover:text-[#452829] dark:hover:text-[#F3E8DF]"
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>Expense</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8D1C5]/30 dark:bg-[#452829]/50">
            {totalCounts.expense}
          </span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex items-center gap-2 flex-1 sm:justify-end">
        {/* Search input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F3E8DF]/60 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF] placeholder-[#57595B]/60"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter transactions by category"
            className="text-xs bg-[#F3E8DF]/60 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl py-1.5 pl-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF] cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
