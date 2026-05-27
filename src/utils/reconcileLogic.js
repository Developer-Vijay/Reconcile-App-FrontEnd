// utils/reconcileLogic.js
export async function reconcileTimesheets({
  mfsFile,
  sapientFile,
  sapientSheet,
  grandTotalIndex,
  mfsSheet,
  mfsColIndex,
}) {
  const formData = new FormData();
  formData.append("mfsFile", mfsFile);
  formData.append("sapientFile", sapientFile);
  formData.append("sapientSheet", sapientSheet);
  formData.append("sapientColIndex", grandTotalIndex);

  if (mfsSheet) formData.append("mfsSheet", mfsSheet);
  if (mfsColIndex !== undefined) formData.append("mfsColIndex", mfsColIndex);

  const response = await fetch("http://127.0.0.1:5000/api/reconcile", {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || "Unknown error");

  // 🧠 Transform mismatches to match frontend keys
  const mismatches = json.mismatches || [];

  return mismatches.map((row) => ({
    name: row["Employee Name"],
    email: row["Emails"] || "-",
    mfsHours: row["The MFS Hours"],
    sapientHours: row["The Sapient Hours"],
    mismatch: row["Difference"],
  }));
}
