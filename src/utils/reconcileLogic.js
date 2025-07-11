import ExcelJS from "exceljs";
import { compareTwoStrings } from "string-similarity";

/**
 * Manual name corrections
 */
const manualNameFixes = {
  "Rajani Chitrala": "Rajani Kanth Chitrala",
  "Bhargavi Jvl": "Bhargavi Jayanti V L",
  "Saiusha S Kashi": "Kashi Sai Usha Sri",
  "Shailendra Patil": "Shailendra Bhosale Patil",
  "Dinesh Sharma": "Dinesh Kumar",
  "Arpitha Shekar": "Arpitha S",
  "Amarendra Veluru": "Veluru Amarendra",
  "Vikash Kumarx": "Vikash Kumar",
};

/**
 * Normalize name: lowercases, trims, and title-cases
 */
const normalizeName = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/**
 * Reformat name from "Last, First" to "First Last"
 */
const reformatName = (name) => {
  if (typeof name === "string" && name.includes(",")) {
    const parts = name.split(",");
    return `${parts[1].trim()} ${parts[0].trim()}`;
  }
  return name;
};

/**
 * Read Excel sheet rows
 */
const parseExcel = async (file, sheetName, skipRows = 0, columns = []) => {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

  const data = [];

  sheet.eachRow((row, rowIndex) => {
    if (rowIndex <= skipRows) return;

    const rowData = {};
    columns.forEach((col, i) => {
      const cell = row.getCell(col + 1); // ExcelJS is 1-indexed
      let value = cell.value;

      if (value === null || value === undefined) {
        value = "";
      } else if (typeof value === "object") {
        if (value.text) {
          value = value.text;
        } else if (value.richText && Array.isArray(value.richText)) {
          value = value.richText.map((t) => t?.text || "").join("");
        } else if (value.result !== undefined) {
          value = value.result;
        } else {
          value = "";
        }
      }

      rowData[i] = value;
    });

    data.push(rowData);
  });

  return data;
};

/**
 * Main reconciliation logic
 */
export const reconcileTimesheets = async ({
  mfsFile,
  sapientFile,
  mfsSheet = "Hours By Resource",
  sapientSheet = "Sheet3",
  grandTotalIndex = 25,
}) => {
  // Read files
  const mfsData = await parseExcel(mfsFile, mfsSheet, 6, [0, 6]); // Name, Hours
  const sapientData = await parseExcel(sapientFile, sapientSheet, 2, [
    0,
    1,
    grandTotalIndex,
  ]); // Name, Email, Hours

  const mfsMap = {};

  mfsData.forEach((row) => {
    let name = reformatName(row[0]);
    name = normalizeName(name);

    if (!name || name === "Totals") return;

    // Apply manual fix if needed
    if (manualNameFixes[name]) {
      name = normalizeName(manualNameFixes[name]);
    }

    mfsMap[name] = parseFloat(row[1]) || 0;
  });

  const results = [];

  sapientData.forEach((row) => {
    const rawName = row[0];
    const email = row[1] || "";
    const sapientHours = parseFloat(row[2]) || 0;

    let name = normalizeName(rawName);

    let mfsHours = mfsMap[name];
    let matchedName = name;

    // Fuzzy match if exact name fails
    if (mfsHours === undefined) {
      let bestScore = 0;
      Object.keys(mfsMap).forEach((candidate) => {
        const score = compareTwoStrings(name, candidate);
        if (score > bestScore) {
          bestScore = score;
          matchedName = candidate;
        }
      });

      if (bestScore >= 0.85) {
        mfsHours = mfsMap[matchedName];
      } else {
        mfsHours = 0;
      }
    }

    const diff = parseFloat((mfsHours - sapientHours).toFixed(2));
    if (Math.abs(diff) > 0.05) {
      results.push({
        name: matchedName,
        email,
        sapientHours,
        mfsHours,
        mismatch: diff, // ✅ correct field used by ResultTable
      });
    }
  });
  const filteredResults = results.filter((r) => {
    const name = r.name?.toLowerCase?.() || "";
    return (
      !name.includes("grand total") &&
      !name.includes("total") &&
      r.sapientHours < 1000 // Prevents garbage 6084 etc.
    );
  });
  return filteredResults;
};
