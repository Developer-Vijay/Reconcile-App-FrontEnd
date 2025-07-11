import React, { useState } from "react";
import { UploadCloud } from "lucide-react"; // Optional icon library
import FileInput from "./FileInput";

export default function FileUpload({ onSubmit }) {
  const [mfsFile, setMfsFile] = useState(null);
  const [sapientFile, setSapientFile] = useState(null);
  const [sapientSheet, setSapientSheet] = useState("Sheet3");
  const [grandTotalIndex, setGrandTotalIndex] = useState(25);
  const [mfsSheet, setMfsSheet] = useState("Hours By Resource");

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
    });
  };

  <FileInput />;

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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Reconcile
      </button>
    </form>
  );
}
