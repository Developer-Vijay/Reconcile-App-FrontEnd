import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import SummaryCard from "../components/SummaryCard";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [resultData, setResultData] = useState([]);

  const handleReconcile = (formData) => {
    // 👇 Simulate result data from backend
    const dummyResult = [
      {
        name: "John Doe",
        sapientHours: 160,
        mfsHours: 152,
        mismatch: 8,
        email: "john@example.com",
      },
      {
        name: "Raj Kumar",
        sapientHours: 160,
        mfsHours: 160,
        mismatch: 0,
        email: "raj.k@example.com",
      },
    ];

    setResultData(dummyResult);

    // 👇 Create summary
    const total = dummyResult.length;
    const mismatched = dummyResult.filter((d) => d.mismatch !== 0).length;
    const matched = total - mismatched;

    setSummary({ total, matched, mismatched });
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
