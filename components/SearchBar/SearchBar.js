import { useState, useCallback } from "react";

// utils
import debounce from "../../utils/debounce";

// styles
import styles from "./SearchBar.module.css";

export function SearchBar({
  onChange = () => {},
  placeholder = "Search data...",
}) {
  const [inputValue, setInputValue] = useState("");

  // Use useCallback to memoize the debounce handler
  const debouncedOnChange = useCallback(
    debounce((value) => onChange(value), 800),
    [onChange] // Recreate the debounce function only if onChange changes
  );

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    debouncedOnChange(value); // Pass the input value to the debounced function
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={styles.searchInput}
      />
    </div>
  );
}
