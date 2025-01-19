/**
 * API Client for CRUD operations
 * Handles API calls, errors, and network issues.
 */

export const apiClient = {
  /**
   * Handle API GET request to fetch all data with pagination, search, and headers.
   * @param {Object} params - Parameters for the API call.
   * @param {string} params.fileName - Name of the file to fetch.
   * @param {number} [params.page=1] - Pagination page number.
   * @param {number} [params.limit=10] - Number of records per page.
   * @param {string} [params.keyword] - Search keyword.
   * @param {string} [params.sortKey] - Sort keyword.
   * @param {string} [params.sortOrder] - Sort order keyword.
   * @returns {Promise<Object>} Parsed API response.
   */
  async fetchAll({
    fileName,
    page = 1,
    limit = 10,
    keyword = "",
    sortKey = "",
    sortOrder = "asc", // default to ascending order
  }) {
    if (!fileName) {
      throw new Error("fileName is required for fetchAll");
    }

    try {
      // Create query parameters including the new sortKey and sortOrder
      const query = new URLSearchParams({
        page,
        limit,
        keyword,
        fileName,
        sortKey,
        sortOrder,
      });

      // Make the API call with the updated query parameters
      const res = await fetch(`/api/v1/crud?${query.toString()}`);

      // Handle the response from the API
      return await handleResponse(res);
    } catch (err) {
      // Handle any errors that occurred during the fetch
      return handleError(err);
    }
  },

  /**
   * Handle API GET request to fetch a single record by Cmdb_id.
   * @param {Object} params - Parameters for the API call.
   * @param {string} params.fileName - Name of the file to fetch.
   * @param {string} params.Cmdb_id - Unique ID of the record to fetch.
   * @returns {Promise<Object>} Parsed API response.
   */
  async fetchById({ fileName, Cmdb_id }) {
    if (!fileName || !Cmdb_id) {
      throw new Error("fileName and Cmdb_id are required for fetchById");
    }

    try {
      const query = new URLSearchParams({ fileName, Cmdb_id });
      const res = await fetch(`/api/v1/crud?${query.toString()}`);
      return await handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Handle API POST request to create a new record.
   * @param {Object} params - Parameters for the API call.
   * @param {string} params.fileName - Name of the file to update.
   * @param {Object} params.data - The data to create a new record.
   * @returns {Promise<Object>} Parsed API response.
   */
  async create({ fileName, data }) {
    if (!fileName || !data) {
      throw new Error("fileName and data are required for create");
    }

    try {
      const res = await fetch(`/api/v1/crud?fileName=${fileName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Handle API PUT request to update a record by Cmdb_id.
   * @param {Object} params - Parameters for the API call.
   * @param {string} params.fileName - Name of the file to update.
   * @param {string} params.Cmdb_id - Unique ID of the record to update.
   * @param {Object} params.data - The updated data.
   * @returns {Promise<Object>} Parsed API response.
   */
  async update({ fileName, Cmdb_id, data }) {
    if (!fileName || !Cmdb_id || !data) {
      throw new Error("fileName, Cmdb_id, and data are required for update");
    }

    try {
      const query = new URLSearchParams({ fileName, Cmdb_id });
      const res = await fetch(`/api/v1/crud?${query.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Handle API DELETE request to remove a record by Cmdb_id.
   * @param {Object} params - Parameters for the API call.
   * @param {string} params.fileName - Name of the file to update.
   * @param {string} params.Cmdb_id - Unique ID of the record to delete.
   * @returns {Promise<Object>} Parsed API response.
   */
  async delete({ fileName, Cmdb_id }) {
    if (!fileName || !Cmdb_id) {
      throw new Error("fileName and Cmdb_id are required for delete");
    }

    try {
      const query = new URLSearchParams({ fileName, Cmdb_id });
      const res = await fetch(`/api/v1/crud?${query.toString()}`, {
        method: "DELETE",
      });
      return await handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

/**
 * Handle API response and parse the result.
 * @param {Response} res - Fetch response object.
 * @returns {Promise<Object>} Parsed response JSON.
 */
async function handleResponse(res) {
  if (res.ok) {
    const data = await res.json();
    return { success: true, ...data };
  }

  // Parse and return API error message
  const error = await res.json();
  throw new Error(error.message || "An unknown error occurred");
}

/**
 * Handle network or other errors.
 * @param {Error} err - Error object.
 * @returns {Object} Error details.
 */
function handleError(err) {
  console.error(err.message);
  return { success: false, message: err.message || "Network error occurred" };
}
