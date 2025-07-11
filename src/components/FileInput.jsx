import React, { useRef, useState } from "react";
import { UploadCloud, CheckCircle, XCircle } from "lucide-react";

const FileInput = ({ label, file, setFile }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(Date.now()); // Ensures re-select of same file triggers change

  const handleFile = (fileObj) => {
    if (!fileObj.name.endsWith(".xlsx")) {
      setError("Only .xlsx files are allowed");
      setFile(null);
    } else {
      setError("");
      setFile(fileObj);
    }

    // Reset the input so same file can be uploaded again
    setInputKey(Date.now());
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <UploadCloud className="h-8 w-8 text-blue-500" />
          <span className="text-gray-500 text-sm">
            {file ? file.name : "Click to upload or drag & drop .xlsx file"}
          </span>

          {file ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : error ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : null}
        </div>

        {/* File Input Field (invisible but functional) */}
        <input
          key={inputKey}
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files[0]) handleFile(e.target.files[0]);
          }}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileInput;
