import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import SummaryCard from "../components/SummaryCard";
import ResultTable from "../components/ResultTable";
import { reconcileTimesheets } from "../utils/reconcileLogic";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [resultData, setResultData] = useState([]);

  const handleReconcile = async (formData) => {
    try {
      const results = await reconcileTimesheets(formData);

      setResultData(results);

      const total = results.length;
      const mismatched = results.filter((d) => d.difference !== 0).length;
      const matched = total - mismatched;
      console.log("🔍 Final Result Data: ", results);
      setSummary({ total, matched, mismatched });
    } catch (err) {
      alert("❌ Failed to process reconciliation: " + err.message);
    }
  };

  const handleSendEmail = () => {
    alert("📨 Sending emails to mismatched employees...");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FileUpload onSubmit={handleReconcile} />

      {summary && (
        <div className="mt-10 max-w-xl mx-auto">
          <SummaryCard
            total={summary.total}
            matched={summary.matched}
            mismatched={summary.mismatched}
            onSendEmail={handleSendEmail}
          />
        </div>
      )}

      {resultData.length > 0 && <ResultTable data={resultData} />}
    </div>
  );
}
