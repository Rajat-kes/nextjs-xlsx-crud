// Components
import Loader from "../Loader/Loader";

// Styles
import styles from "./Table.module.css";

export function Table({
  data = [],
  headers,
  isLoading,
  sortKey,
  sortOrder,
  onSortChange = () => {},
  handleOpenEditMode = () => {},
}) {
  const handleSort = (key) => {
    const newSortOrder =
      sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(key, newSortOrder);
  };

  if (isLoading) {
    return (
      <div className={`${styles.noData} ${styles.tableSize}`}>
        <Loader />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`${styles.noData} ${styles.tableSize}`}>
        No data available
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${styles.tableSize}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                onClick={() => handleSort(header.key)}
                className={`${styles.sortableHeader} ${
                  sortKey === header.key ? styles.activeHeader : ""
                }`}
              >
                {header.label}
                {sortKey === header.key && (
                  <span className={styles.sortIcon}>
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.Cmdb_id}
              onClick={() => handleOpenEditMode(row.Cmdb_id)}
              className={styles.tableRow}
            >
              {headers.map((header) => (
                <td key={`${row.Cmdb_id}-${header.key}`}>{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
