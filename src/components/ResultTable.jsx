import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Component to display reconciliation result as a table and allow download as Excel.
 *
 * @param {Array} data - Array of mismatch entries with fields:
 *   - name: string
 *   - sapientHours: number
 *   - mfsHours: number
 *   - mismatch: number
 *   - email: string
 */
export default function ResultTable({ data = [] }) {
  if (!data.length) return null;

  // Handler to export table data to Excel
  const handleDownload = () => {
    const exportData = data.map((row) => ({
      "Employee Name": row.name,
      "Sapient Hours": row.sapientHours,
      "MFS Hours": row.mfsHours,
      "Mismatch Hours": row.mismatch,
      Email: row.email || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mismatches");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Reconciliation_Mismatches.xlsx");
  };

  return (
    <div className="overflow-x-auto mt-10 max-w-6xl mx-auto">
      {/* Download button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ⬇️ Download Excel
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="text-left py-3 px-4">Employee Name</th>
            <th className="text-left py-3 px-4">Sapient Hours</th>
            <th className="text-left py-3 px-4">MFS Hours</th>
            <th className="text-left py-3 px-4">Mismatch Hours</th>
            <th className="text-left py-3 px-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-3 px-4 font-medium text-gray-800">
                {entry.name}
              </td>
              <td className="py-3 px-4">{entry.sapientHours}</td>
              <td className="py-3 px-4">{entry.mfsHours}</td>
              <td
                className={`py-3 px-4 font-semibold ${
                  entry.mismatch > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {entry.mismatch}
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">
                {entry.email || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
