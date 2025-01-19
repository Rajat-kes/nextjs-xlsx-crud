// styles
import styles from "./Tabs.module.css";

// constants
export const defaultTabs = [
  { id: "certificate", label: "Certificate" },
  { id: "server", label: "Server" },
  { id: "sysid", label: "Sysid" },
];

export function Tabs({
  tabs = defaultTabs,
  activeTabId = "certificate",
  onChange = () => {},
}) {
  if (!Array.isArray(tabs) || tabs.some((tab) => !tab.id || !tab.label)) {
    tabs = defaultTabs;
  }
  return (
    <div className={styles.searchContainer}>
      {tabs?.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.searchTab} ${
            tab.id === activeTabId ? styles.activeTab : ""
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
