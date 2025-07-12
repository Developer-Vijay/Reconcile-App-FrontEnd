import React, { useState } from "react";
import FileInput from "./FileInput";

export default function FileUpload({ onSubmit, loading }) {
  const [mfsFile, setMfsFile] = useState(null);
  const [sapientFile, setSapientFile] = useState(null);
  const [sapientSheet, setSapientSheet] = useState("Sheet3");
  const [grandTotalIndex, setGrandTotalIndex] = useState(25);
  const [mfsSheet, setMfsSheet] = useState("Hours By Resource");
  const [mfsColIndex, setMfsColIndex] = useState(6);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sapientFile || !mfsFile) {
      alert("Please upload both files.");
      return;
    }
    if (!sapientSheet || grandTotalIndex === "") {
      alert("Sapient sheet name and column index are required.");
      return;
    }

    onSubmit({
      mfsFile,
      sapientFile,
      sapientSheet,
      grandTotalIndex,
      mfsSheet: mfsSheet || undefined,
      mfsColIndex: mfsColIndex !== "" ? Number(mfsColIndex) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        🧾 Timesheet Reconciliation
      </h2>

      <FileInput label="MFS Excel File" file={mfsFile} setFile={setMfsFile} />
      <FileInput
        label="Sapient Excel File"
        file={sapientFile}
        setFile={setSapientFile}
      />

      <div>
        <label className="block mb-1 font-medium">Sapient Sheet Name</label>
        <input
          type="text"
          value={sapientSheet}
          onChange={(e) => setSapientSheet(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Grand Total Column Index (0-based)
        </label>
        <input
          type="number"
          value={grandTotalIndex}
          onChange={(e) => setGrandTotalIndex(Number(e.target.value))}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">MFS Sheet Name</label>
        <input
          type="text"
          value={mfsSheet}
          onChange={(e) => setMfsSheet(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          MFS Hours Column Index (optional, 0-based)
        </label>
        <input
          type="number"
          value={mfsColIndex}
          onChange={(e) => setMfsColIndex(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Defaults to column 6"
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 rounded text-white font-semibold transition ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Reconciling...</span>
          </div>
        ) : (
          "🔍 Reconcile"
        )}
      </button>
    </form>
  );
}
