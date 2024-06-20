"use client";
import React, { useState } from "react";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import Metrics from "./components/metrics/metrics";
import NonEditableMetrics from "./components/metrics/nonEditableMetrics";
import PatentList from "./components/patent/patentList";
import SearchText from "./components/search/searchText";
import LoadingSpinner from "./components/loading/loadingSpinner";
import useMetricSearchStateStore from "@/stores/useMetricStore";
import "./styles.css";
import { useFetchMetrics } from "@/hooks/useSearchMetrics";

const Index = () => {
  const { storeMetrics, setAll } = useMetricSearchStateStore();
  const [patentQuery, setPatentQuery] = useState<string>("");
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
    unlockMetrics
  } = useFetchMetrics();

  const handleFetchMetrics = () => {
    fetchMetrics(patentQuery);
  };

  const handleLockMetricsAndSearch = () => {
    lockMetricsAndSearch(metrics);
  };

  return (
    <>
      <div className="colored-div">
        <Navbar />
        <div className="animation-container">
          <div className="search-container">
            <h2 className="search-bar-title">Search Patents</h2>
            <textarea
              className="search-textarea"
              onChange={(e) => setPatentQuery(e.target.value)}
              placeholder="Describe your invention in 500 words or less."
            />
            <button className="search-button" onClick={handleFetchMetrics}>
              Search
            </button>
            {error && <div>Error: {error}</div>}
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
              <NonEditableMetrics metrics={metrics} unlockMetrics={unlockMetrics}/>
          )}
          {/* if there are no metrics, search results, and its not loading */}
          {!searchResults && metrics.length == 0 && !isLoading && <SearchText />}
          {/* if the metrics are locked and there are search results */}
          {isMetricsLocked && searchResults && (
            <PatentList
              items={searchResults}
              metrics={metrics}
              search={patentQuery}
            />
          )}
          {/* if loading, populate the spinner */}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
