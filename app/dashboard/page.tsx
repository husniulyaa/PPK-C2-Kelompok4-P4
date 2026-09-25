import SummaryCards from "@/components/dashboard/SummaryCards";
import FinancialCharts from "@/components/dashboard/FinancialCharts";
import TransactionFilters from "@/components/dashboard/TransactionFilters";
import TransactionTable from "@/components/dashboard/TransactionTable";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Keuangan</h1>
        <AddTransactionModal />
      </div>

      <SummaryCards />
      <FinancialCharts />

      <div className="mt-8">
        <TransactionFilters />
        <TransactionTable />
      </div>
    </div>
  );
}
