"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import Metrics from "./components/metrics/metrics";
import NonEditableMetrics from "./components/metrics/nonEditableMetrics";
import PatentList from "./components/patent/patentList";
import SearchText from "./components/search/searchText";
import LoadingSpinner from "./components/loading/loadingSpinner";
import useMetricSearchStateStore from "@/stores/useMetricStore";
import styles from "./styles.module.css";
import { useFetchMetrics } from "@/hooks/useSearchMetrics";

const Index = () => {
  const { storeMetrics, setAll } = useMetricSearchStateStore();
  const [patentQuery, setPatentQuery] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(50);
  const [numSearches, setNumSearches] = useState<number>(10);
  const {
    searchResults,
    error,
    metrics,
    isMetricsLocked,
    isLoading,
    fetchMetrics,
    lockMetricsAndSearch,
    addMetric,
    removeMetric,
    editMetric,
    unlockMetrics,
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

  return (
    <>
      <div className={styles.colored_div}>
        <Navbar />
        <div className={styles.animation_container}>
          <div className={styles.slider_container}>
            <div className={styles.slider_label}>Threshold</div>
            <input
              type="range"
              className={styles.slider}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={0}
              max={100}
            />
            <div className={styles.slider_value}>{threshold}</div>
            <div className={styles.slider_label}>Number of Searches</div>
            <input
              type="range"
              className={styles.slider}
              value={numSearches}
              onChange={(e) => setNumSearches(Number(e.target.value))}
              min={10}
              max={50}
            />
            <div className={styles.slider_value}>{numSearches}</div>
          </div>
          <div className={styles.search_container}>
            <h2 className={styles.search_bar_title}>Search{"\n"}Patents</h2>
            <div className={styles.search_input_wrapper}>
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
          </div>
          {!isMetricsLocked && metrics.length > 0 && (
            <Metrics
              metrics={metrics}
              addMetric={addMetric}
              editMetric={editMetric}
              removeMetric={removeMetric}
              lockMetrics={handleLockMetricsAndSearch}
            />
          )}
          {isMetricsLocked && (
            <NonEditableMetrics
              metrics={metrics}
              unlockMetrics={unlockMetrics}
            />
          )}
          {!searchResults && metrics.length === 0 && !isLoading && (
            <SearchText />
          )}
          {isMetricsLocked && searchResults && (
            <PatentList
              items={searchResults}
              metrics={metrics}
              search={patentQuery}
            />
          )}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
