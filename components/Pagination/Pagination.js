import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  projectsPerPage,
  totalProjects,
  paginate,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  return (
    <div className={styles["pagination-container"]}>
      {/* Previous Button */}
      <button
        className={`${styles["pagination-button"]} ${
          currentPage === 1 ? styles["disabled"] : ""
        }`}
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Current Active Page */}
      <span className={styles["current-page"]}>{currentPage}</span>

      {/* Next Button */}
      <button
        className={`${styles["pagination-button"]} ${
          currentPage === totalPages ? styles["disabled"] : ""
        }`}
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
