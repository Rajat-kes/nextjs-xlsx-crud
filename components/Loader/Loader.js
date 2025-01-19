import React from "react";

// Styles
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderCircle}></div>
    </div>
  );
};

export default Loader;
