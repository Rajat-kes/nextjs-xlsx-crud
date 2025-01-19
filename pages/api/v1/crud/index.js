import { promises as fs } from "fs";

// Utility to get the file path for a given filename
import {
  getFilePath,
  readExcelFile,
  writeExcelFile,
  sendSuccessResponse,
  sendErrorResponse,
  transformHeaderArrayToObjects,
  searchData,
  sortData,
  paginateData,
  transformHeaderArrayToKeyLabel,
} from "../../../../utils/api-utils";

export default async function handler(req, res) {
  const { method } = req;
  const {
    fileName = "certificate",
    page = 1,
    limit = 10,
    keyword,
    Cmdb_id,
    sortKey,
    sortOrder,
  } = req.query;

  if (!fileName) {
    return sendErrorResponse(res, 400, "Missing fileName parameter");
  }

  const filePath = await getFilePath(fileName);

  try {
    // Ensure the file exists
    await fs.access(filePath);

    // Read data and keys from the Excel file
    const { data, keys } = await readExcelFile(filePath);

    switch (method) {
      case "GET":
        if (Cmdb_id) {
          // Fetch a single record by Cmdb_id
          const record = data.find(
            (item) => String(item.Cmdb_id) === String(Cmdb_id)
          );
          if (!record) {
            return sendErrorResponse(
              res,
              404,
              `Record with Cmdb_id ${Cmdb_id} not found`
            );
          }
          return sendSuccessResponse(res, 200, {
            success: true,
            data: record,
            headers: transformHeaderArrayToKeyLabel(keys),
            nonEditableHeaders: ["Cmdb_id"],
          });
        } else {
          // Apply search
          let filteredData = searchData(data, keyword);

          // Apply sorting
          filteredData = sortData(filteredData, sortKey, sortOrder);

          // Apply pagination
          const {
            paginatedData,
            total,
            page: currentPage,
            limit: pageLimit,
          } = paginateData(filteredData, page, limit);

          return sendSuccessResponse(res, 200, {
            success: true,
            headers: transformHeaderArrayToObjects(keys),
            data: paginatedData,
            total,
            page: currentPage,
            limit: pageLimit,
          });
        }

      case "POST":
        // Create a new record
        const newData = { ...req.body, Cmdb_id: Date.now() }; // Ensure Cmdb_id is unique
        data.push(newData);
        await writeExcelFile(filePath, data);
        return sendSuccessResponse(res, 201, { success: true, newData });

      case "PUT":
        // Update a record by Cmdb_id
        if (!Cmdb_id) {
          return sendErrorResponse(res, 400, "Missing Cmdb_id parameter");
        }

        const indexToUpdate = data.findIndex(
          (item) => String(item.Cmdb_id) === String(Cmdb_id)
        );
        if (indexToUpdate === -1) {
          return sendErrorResponse(
            res,
            404,
            `Record with Cmdb_id ${Cmdb_id} not found`
          );
        }

        // Prevent updating Cmdb_id field
        const updatedRecord = {
          ...data[indexToUpdate],
          ...req.body,
          Cmdb_id: data[indexToUpdate].Cmdb_id,
        };
        data[indexToUpdate] = updatedRecord;

        await writeExcelFile(filePath, data);
        return sendSuccessResponse(res, 200, { success: true, updatedRecord });

      case "DELETE":
        // Delete a record by Cmdb_id
        if (!Cmdb_id) {
          return sendErrorResponse(res, 400, "Missing Cmdb_id parameter");
        }

        const indexToDelete = data.findIndex(
          (item) => String(item.Cmdb_id) === String(Cmdb_id)
        );
        if (indexToDelete === -1) {
          return sendErrorResponse(
            res,
            404,
            `Record with Cmdb_id ${Cmdb_id} not found`
          );
        }

        const deletedRecord = data.splice(indexToDelete, 1);
        await writeExcelFile(filePath, data);
        return sendSuccessResponse(res, 200, {
          success: true,
          deletedRecord: deletedRecord[0],
        });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return sendErrorResponse(res, 405, `Method ${method} Not Allowed`);
    }
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
}
