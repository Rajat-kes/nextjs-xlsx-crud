import { promises as fs } from "fs";
import path from "path";
import * as XLSX from "xlsx";

// Utility to get the file path for a given filename or search for files containing the keyword
export const getFilePath = async (fileName, dir = "uploads") => {
  const dataDir = path.join(process.cwd(), dir); // Resolve directory path

  // Read the directory to get all files
  const files = await fs.readdir(dataDir);

  // Filter files that contain the "fileName" in their name
  const matchingFiles = files.filter((file) =>
    file.toLowerCase().includes(fileName.toLowerCase())
  );

  // If there are any matching files, return the first one
  if (matchingFiles.length > 0) {
    return path.join(dataDir, matchingFiles[0]);
  }

  // If no matching files, return the full path for the provided fileName
  return path.join(dataDir, fileName);
};

// Utility to read an Excel file and parse it into JSON
export const readExcelFile = async (filePath) => {
  // Read the Excel file
  const file = await fs.readFile(filePath);
  const workbook = XLSX.read(file, { type: "buffer" });

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Extract the entire sheet data as a 2D array
  const sheetData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  // Check if the sheet has data
  if (!sheetData || sheetData.length === 0) {
    throw new Error("The sheet is empty or has invalid data.");
  }

  // Extract keys (column headers) from the first row
  const keys = sheetData[0]; // First row

  // Extract the rest of the data as an array of objects
  const data = sheetData.slice(1).map((row) => {
    // Map each column to its respective key
    return keys.reduce((obj, key, index) => {
      obj[key] = row[index] ?? ""; // Ensure undefined values are replaced with an empty string
      return obj;
    }, {});
  });

  return { keys, data };
};

// Utility to write JSON data back to an Excel file
export const writeExcelFile = async (filePath, data) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  await fs.writeFile(
    filePath,
    XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
  );
};

// Standardized response handlers
export const sendSuccessResponse = (res, statusCode, data) =>
  res.status(statusCode).json(data);

export const sendErrorResponse = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message });

export function transformHeaderArrayToObjects(array) {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    console.error("Invalid input: Expected an array");
    return [];
  }

  return array
    .filter((item) => typeof item === "string") // Filter out any non-string items
    .map((item) => {
      // Create the label by replacing underscores with spaces and capitalizing each word
      const label = item
        .split("_") // Split by underscore
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join with a space

      return {
        key: item, // Original string as key
        label: label, // Transformed string as label
      };
    });
}

export function transformHeaderArrayToKeyLabel(array) {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    console.error("Invalid input: Expected an array");
    return {};
  }

  return array
    .filter((item) => typeof item === "string") // Filter out any non-string items
    .reduce((acc, item) => {
      // Create the label by replacing underscores with spaces and capitalizing each word
      const label = item
        .split("_") // Split by underscore
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join with a space

      acc[item] = label; // Add key-value pair to accumulator
      return acc;
    }, {});
}

// Utility to search data by keyword
export const searchData = (data, keyword) => {
  if (!keyword) return data;
  return data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

// Utility to sort data by a key and order
export const sortData = (data, sortKey, sortOrder) => {
  if (!sortKey || !sortOrder) return data;
  return [...data].sort((a, b) => {
    const valueA = String(a[sortKey] || "").toLowerCase();
    const valueB = String(b[sortKey] || "").toLowerCase();

    if (sortOrder === "asc") {
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    } else if (sortOrder === "desc") {
      return valueB.localeCompare(valueA, undefined, { numeric: true });
    }
    return 0;
  });
};

// Utility to paginate data
export const paginateData = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return {
    paginatedData: data.slice(startIndex, startIndex + parseInt(limit, 10)),
    total: data.length,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
};
