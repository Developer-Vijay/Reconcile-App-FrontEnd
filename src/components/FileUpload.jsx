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
    if (!mfsFile || !sapientFile) {
      alert("Please upload both files.");
      return;
    }
    onSubmit({
      mfsFile,
      sapientFile,
      sapientSheet,
      grandTotalIndex,
      mfsSheet,
      mfsColIndex: mfsColIndex !== "" ? Number(mfsColIndex) : undefined,
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileDetails = (file, label, onRemove) => (
    <div className="mt-2 text-sm text-gray-700">
      ✅ {label}: {file.name} ({formatSize(file.size)})
      <button
        type="button"
        className="ml-2 text-red-600 hover:underline"
        onClick={onRemove}
        disabled={loading}
      >
        Remove
      </button>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        🧾 TimeSheet Reconciliation
      </h2>

      <FileInput label="MFS Excel File" file={mfsFile} setFile={setMfsFile} />
      {mfsFile &&
        renderFileDetails(mfsFile, "MFS File", () => setMfsFile(null))}

      <FileInput
        label="Sapient Excel File"
        file={sapientFile}
        setFile={setSapientFile}
      />
      {sapientFile &&
        renderFileDetails(sapientFile, "Sapient File", () =>
          setSapientFile(null)
        )}

      <div>
        <label className="block mb-1 font-medium">Sapient Sheet Name</label>
        <input
          type="text"
          value={sapientSheet}
          onChange={(e) => setSapientSheet(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Grand Total Column Index For Sapient File (0-based)
        </label>
        <input
          type="number"
          value={grandTotalIndex}
          onChange={(e) => setGrandTotalIndex(Number(e.target.value))}
          className="w-full border p-2 rounded"
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
          MFS Total Hours Column Index (optional, 0-based)
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
        disabled={loading}
        className={`w-full py-2 rounded text-white transition font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Reconciling..." : "Reconcile"}
      </button>
    </form>
  );
}
