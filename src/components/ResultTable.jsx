import React from "react";

export default function ResultTable({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="text-left py-3 px-4">Employee Name</th>
            <th className="text-left py-3 px-4">Sapient Hours</th>
            <th className="text-left py-3 px-4">MFS Hours</th>
            <th className="text-left py-3 px-4">Mismatch</th>
            <th className="text-left py-3 px-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-3 px-4 font-medium">{entry.name}</td>
              <td className="py-3 px-4">{entry.sapientHours}</td>
              <td className="py-3 px-4">{entry.mfsHours}</td>
              <td
                className={`py-3 px-4 font-semibold ${
                  entry.mismatch > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {entry.mismatch}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {entry.email || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
