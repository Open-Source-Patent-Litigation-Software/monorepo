"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import PatentList from "./components/patentList";
import { patentsMockData } from "./mockData";
import styles from "./saved.module.css";

const SavedPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPatents, setFilteredPatents] = useState<any[]>([]);

  const patents = patentsMockData;

  useEffect(() => {
    const filteredPatents = patents.filter((patent) =>
      patent.search.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPatents(filteredPatents);
  }, [searchQuery, patents]);

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
          <PatentList patents={filteredPatents} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedPage;
