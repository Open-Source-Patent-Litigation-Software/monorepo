"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import Metrics from "./components/metrics/metrics";
import PatentList from "./components/patent/patentList";
import SearchText from "./components/search/searchText";
import LoadingSpinner from "./components/loading/loadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import useMetricSearchStateStore from "@/stores/useMetricStore";
import styles from "./styles.module.css";
import { useFetchMetrics } from "@/hooks/useSearchMetrics";
import { PatentItem } from "@/types/types";

function sortPatentItems(items: PatentItem[], scoreIndex?: number): PatentItem[] {
  if (scoreIndex !== undefined) {
    // Sort by individual score at the given index
    return items.sort((a, b) => {
      const scoreA = a.score.scores[scoreIndex] || 0;
      const scoreB = b.score.scores[scoreIndex] || 0;
      return scoreB - scoreA;
    });
  } else {
    // Sort by total score
    return items.sort((a, b) => b.score.total - a.score.total);
  }
}

const Index = () => {
  const { storeMetrics, setAll } = useMetricSearchStateStore();
  const [patentQuery, setPatentQuery] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0);
  const [numSearches, setNumSearches] = useState<number>(10);
  const {
    searchResults,
    error,
    metrics,
    isMetricsLocked,
    metricsLoading,
    searchLoading,
    fetchMetrics,
    lockMetricsAndSearch,
    addMetric,
    removeMetric,
    editMetric,
    unlockMetrics,
    setSearchResults
  } = useFetchMetrics();

  const handleFetchMetrics = () => {
    fetchMetrics(patentQuery);
  };

  const handleLockMetricsAndSearch = () => {
    lockMetricsAndSearch(metrics, threshold, numSearches);
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const [selectedTag, setSelectedTag] = useState<number>(-1);

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  }

  const handleNumPatentsChange = (value: number) => {
    setNumSearches(value);
  }

  const handleTagClick = (index: number) => {
    if(searchResults != null) {
      if(selectedTag == index) {
        setSelectedTag(-1);
        setSearchResults(sortPatentItems(searchResults));
      } else {
        setSelectedTag(index);
        setSearchResults(sortPatentItems(searchResults, index));
      }
    }
  };

  console.log("search loading: ", searchLoading);
  console.log("metrics lock", isMetricsLocked);

  return (
    <>
      <div className={styles.colored_div}>
        <Navbar />
        <div className={styles.animation_container}>
          <div className={styles.searchCard}>
            <div className={styles.headerContainer}>
              <h1 className={styles.headerTitle}>
                Search for Patents
              </h1>
            </div>
            <div className={styles.search_container}>
              <textarea
                className={styles.search_textarea}
                onChange={(e) => setPatentQuery(e.target.value)}
                placeholder="Describe your invention in 500 words or less."
              />
              <button
                className={styles.search_button}
                onClick={handleFetchMetrics}
              >
                Search
              </button>
            </div>
            <AnimatePresence>
              {!isMetricsLocked && (metricsLoading || metrics.length > 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Metrics
                    metrics={metrics}
                    addMetric={addMetric}
                    editMetric={editMetric}
                    removeMetric={removeMetric}
                    lockMetrics={handleLockMetricsAndSearch}
                    threshold={threshold}
                    numPatents={numSearches}
                    handleNumPatentsChange={handleNumPatentsChange}
                    handleThresholdChange={handleThresholdChange}
                    loading={metricsLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isMetricsLocked && (searchResults != null || searchLoading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PatentList
                    items={searchResults}
                    metrics={metrics}
                    search={patentQuery}
                    handleTagClick={handleTagClick}
                    selectedTag={selectedTag}
                    unlockMetrics={unlockMetrics}
                    loading={searchLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!searchResults && metrics.length === 0 && !searchLoading && !metricsLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SearchText />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
