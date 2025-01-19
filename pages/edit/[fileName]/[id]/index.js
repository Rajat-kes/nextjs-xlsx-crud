"use client";

import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// api client
import { apiClient } from "../../../../apiClient";

// components
import { Header } from "../../../../components/Header/Header";
import Loader from "../../../../components/Loader/Loader";

// styles
import styles from "../../../../styles/Edit.module.css";

const EditDetail = () => {
  const router = useRouter();

  // state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState({});
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // fetch data
      apiClient
        .fetchById({
          fileName: router.query.fileName,
          Cmdb_id: router.query.id,
        })
        .then((response) => {
          if (response?.success) {
            setApiData(response);
            setFormData(response?.data || {});
          } else {
            setErrorMessage(
              `${router.query?.fileName} not found with Id: ${router.query?.id}`
            );
          }
        })
        .catch((error) => {
          setErrorMessage(
            `${router.query?.fileName} not found with Id: ${router.query?.id}`
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    if (router.query?.id && router.query?.fileName) {
      fetchData();
    }
  }, [router.query?.id, !router.query?.fileName]);

  const updateFormData = useCallback(() => {
    setIsLoading(true);
    apiClient
      .update({
        fileName: router.query.fileName,
        Cmdb_id: router.query.id,
        data: formData,
      })
      .then((response) => {
        if (response?.success) {
          setIsEditing(false);
          setErrorMessage(
            `${router.query?.fileName} Updating record successful with Id: ${router.query?.id} Redirecting to home`
          );
          setTimeout(() => {
            router.push(`/`);
          }, 2000);
        } else {
          setErrorMessage(
            `${router.query?.fileName} Error updating record with Id: ${router.query?.id}`
          );
        }
      })
      .catch((error) => {
        setErrorMessage(
          `${router.query?.fileName} Error updating record with Id: ${router.query?.id}`
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [formData, apiData, router.query]);

  // render loader if data is loading
  if (isLoading || !router.query?.id || !router.query?.fileName) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Decommission Edit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header title={`Decommission Edit`} />
        <div className={styles.container}>
          {/* render error message */}
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}

          {!!Object.keys(formData || {})?.length && (
            <>
              {/* render button */}
              <div className={styles.header}>
                <h2
                  className={styles.heading}
                >{`${router.query?.fileName} Details`}</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.button}
                  >
                    Edit
                  </button>
                ) : (
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={updateFormData}
                      className={styles.saveButton}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(apiData?.data || {});
                      }}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* render form */}
              <div className={styles.form}>
                {Object.entries(formData).map(([key, value]) => {
                  // if (apiData?.nonEditableHeaders?.includes(key)) return null; // Skip id field
                  return (
                    <div key={key} className={styles.formGroup}>
                      <label>{apiData?.headers?.[key] || key}</label>
                      {isEditing &&
                      !apiData?.nonEditableHeaders?.includes(key) ? (
                        <input
                          type="text"
                          value={formData?.[key] || ""}
                          onChange={(e) =>
                            setFormData((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    [key]: e.target.value,
                                  }
                                : null
                            )
                          }
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.value}>{value}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default EditDetail;
