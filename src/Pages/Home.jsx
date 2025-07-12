import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import SummaryCard from "../components/SummaryCard";
import ResultTable from "../components/ResultTable";
import { reconcileTimesheets } from "../utils/reconcileLogic";
import { toast } from "react-hot-toast";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleReconcile = async (formData) => {
    try {
      setIsLoading(true);
      toast.loading("Reconciling sheets...");

      const results = await reconcileTimesheets(formData);
      toast.dismiss();

      const filteredResults = results.filter(
        (d) =>
          d.name &&
          d.name.toLowerCase() !== "grand total" &&
          d.name.toLowerCase() !== "totals"
      );

      setResultData(filteredResults);

      const total = filteredResults.length;
      const mismatched = filteredResults.filter(
        (d) => Math.abs(d.mismatch || d.Difference || 0) > 0.05
      ).length;
      const matched = total - mismatched;

      setSummary({ total, matched, mismatched });

      toast.success("✅ Reconciliation complete!");
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    toast("📨 Email feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FileUpload onSubmit={handleReconcile} loading={isLoading} />

      {summary && !isLoading && (
        <div className="mt-10 max-w-xl mx-auto">
          <SummaryCard
            total={summary.total}
            matched={summary.matched}
            mismatched={summary.mismatched}
            onSendEmail={handleSendEmail}
          />
        </div>
      )}

      {!isLoading && resultData.length > 0 && <ResultTable data={resultData} />}
    </div>
  );
}
