import { promises as fs } from "fs";
import { getFilePath, sendErrorResponse } from "../../../../utils/api-utils";

export default async function handler(req, res) {
  const { method } = req;
  const { fileName = "certificate" } = req.query;

  if (method !== "GET") {
    return sendErrorResponse(res, 405, "Method Not Allowed");
  }

  if (!fileName) {
    return sendErrorResponse(res, 400, "Missing fileName parameter");
  }

  try {
    // Get the file path for the given fileName
    const filePath = await getFilePath(fileName);

    // Ensure the file exists
    await fs.access(filePath);

    // Read the file content
    const file = await fs.readFile(filePath);

    // Set headers for file download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}".xlsx`);

    // Send the file content
    return res.status(200).send(file);
  } catch (error) {
    // Handle errors (file not found, access issues, etc.)
    return sendErrorResponse(
      res,
      500,
      `Failed to download file: ${error.message}`
    );
  }
}
