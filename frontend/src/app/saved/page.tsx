"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import PatentList from "./components/patentList";
import styles from "./saved.module.css";
import { useGetSavedPatents } from "@/hooks/useGetSavedPatents";
import { Patent } from "./types";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [patents, setPatents] = useState<Patent[]>([]);
  const { fetchedPatents } = useGetSavedPatents();

  useEffect(() => {
    if (fetchedPatents && fetchedPatents.patents) {
      setPatents(fetchedPatents.patents);
    }
  }, [fetchedPatents]);

  const removePatent = (id: string) => {
    setPatents((prevPatents) => {
      const updatedPatents = prevPatents.filter(
        (patent) => patent.patentInfo.id !== id
      );
      return updatedPatents;
    });
  };

  const filteredPatents = patents.filter((patent) =>
    patent.search.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={styles.coloredDiv}>
        <Navbar />
        <div className={styles.animationContainer}>
          <div className={styles.searchContainer}>
            <h2 className={styles.searchBarTitle}>Saved{"\n"}Patents</h2>
            <div className={styles.searchInputWrapper}>
              <textarea
                className={styles.searchInput}
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {filteredPatents.length === 0 ? (
            <div className={styles.noResults}>No saved patents found.</div>
          ) : (
            <PatentList patents={filteredPatents} removePatent={removePatent} />
          )}
        </div>xp
      </div>
      <Footer />
    </>
  );
};

export default Page;
