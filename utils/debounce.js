// utils/debounce.js
export default function debounce(func, delay) {
  let timeoutId;

  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };

  // Add cancel method to clear timeout
  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}
