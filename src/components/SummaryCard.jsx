import React from "react";
import { Mail } from "lucide-react";

export default function SummaryCard({
  total,
  matched,
  mismatched,
  onSendEmail,
}) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">📊 Summary</h3>

      <div className="flex justify-around text-gray-700 font-medium">
        <div>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
          <p>Total Employees</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-500">{matched}</p>
          <p>Matched</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-red-500">{mismatched}</p>
          <p>Mismatched</p>
        </div>
      </div>

      <button
        onClick={onSendEmail}
        className="mt-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        <Mail className="mr-2 h-4 w-4" />
        Send Email to Mismatched
      </button>
    </div>
  );
}
