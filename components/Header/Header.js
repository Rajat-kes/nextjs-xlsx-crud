import styles from "./Header.module.css";

export function Header({ title = "Decommission Dashboard" }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
    </header>
  );
}
