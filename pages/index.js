"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

// api client
import { apiClient } from "../apiClient";

// components
import Pagination from "../components/Pagination/Pagination";
import { Header } from "../components/Header/Header";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { Table } from "../components/Table/Table";
import { Tabs, defaultTabs } from "../components/Tabs/Tabs";

// styles
import styles from "../styles/Home.module.css";

// constants
const projectsPerPage = 10;
const totalProjects = 100;
const firstTabId = defaultTabs[0].id;

export default function Home() {
  const router = useRouter();

  // state
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(firstTabId);
  const [listdata, setListdata] = useState({});
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.fetchAll({
          fileName: activeTab || firstTabId,
          page: currentPage,
          limit: projectsPerPage,
          keyword: search,
          sortKey: sortKey,
          sortOrder: sortOrder,
        });
        if (response?.success) {
          setListdata(response);
        } else {
          console.error("Error fetching tabledata");
          setListdata({});
        }
      } catch (error) {
        console.error("Error fetching tabledata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchData();
  }, [search, currentPage, activeTab, sortOrder, sortKey]);

  // pagination page numbers update
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // search query update
  const handleUpdateSearch = useCallback((query) => {
    setSearch(query);
    paginate(1);
  }, []);

  // tab change update
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    paginate(1);
  }, []);

  // sort key and order update
  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
    paginate(1);
  }, []);

  // open edit mode
  const handleOpenEditMode = useCallback(
    (id) => {
      router.push(`/edit/${activeTab}/${id}`);
    },
    [activeTab]
  );

  // Download xlsx file
  const downloadFile = useCallback(async () => {
    try {
      // Fetch the file blob using the API client
      const fileBlob = await apiClient.download({ fileName: activeTab });

      if (!fileBlob || !(fileBlob instanceof Blob)) {
        return console.error("Invalid file format or empty file received");
      }

      // Create a link element to trigger the download
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(fileBlob);
      link.href = objectUrl;
      link.download = `${activeTab}.xlsx`; // Ensure a proper filename with extension
      link.style.display = "none"; // Hide the link element
      document.body.appendChild(link);

      link.click(); // Trigger the download
      URL.revokeObjectURL(objectUrl); // Clean up the object URL
      document.body.removeChild(link); // Remove the link element
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }, [activeTab]);

  return (
    <>
      <Head>
        <title>Decommission Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <div className={styles.container}>
          <SearchBar onChange={handleUpdateSearch} />
          <div className={styles.tabsWrapper}>
            <Tabs onChange={handleTabChange} activeTabId={activeTab} />
            <button
              className={`${styles.linkButton} ${
                !listdata?.data?.length ? styles.disabled : ""
              }`}
              onClick={downloadFile}
            >
              Export to. Excel
            </button>
          </div>
          <Table
            data={listdata?.data}
            headers={listdata?.headers}
            isLoading={isLoading}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            handleOpenEditMode={handleOpenEditMode}
          />
          <div className={styles.paginationWrapper}>
            <Pagination
              projectsPerPage={listdata?.limit || projectsPerPage}
              totalProjects={listdata?.total || 0}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </main>
    </>
  );
}
