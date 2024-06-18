"use client";
import React, { useState } from "react";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import Metrics from "./components/metrics/metrics";
import PatentList from "./components/patent/patentList";
import SearchText from "./components/search/searchText";
import LoadingSpinner from "./components/loading/loadingSpinner";
import useMetricSearchStateStore from "@/stores/useMetricStore";
import "./styles.css";
import { useFetchMetrics } from "@/hooks/useMetrics";
import { SearchVal } from "@/types/types";
import NonEditableMetrics from "./components/metrics/nonEditableMetrics";

const Index = () => {
  const backendUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;
  const { storeMetrics, setAll } = useMetricSearchStateStore();
  const [patentQuery, setPatentQuery] = useState<string>("");
  const {
    data,
    error,
    metrics,
    isMetricsLocked,
    searchState,
    fetchMetrics,
    lockMetrics,
    fetchSearchResults,
    addMetric,
    removeMetric,
    editMetric
  } = useFetchMetrics();

  const handleFetchMetrics = () => {
    fetchMetrics(patentQuery, backendUrl);
  };

  const handleFetchSearchResults = () => {
    fetchSearchResults(patentQuery, backendUrl);
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
              Fetch Metrics
            </button>
            {error && <div>Error: {error}</div>}
          </div>
          {searchState === SearchVal.dataAvailable && !isMetricsLocked && (
            <>
              <Metrics
                metrics={metrics}
                addMetric={addMetric}
                editMetric={editMetric}
                removeMetric={removeMetric}
              />
              <button className="search-button" onClick={handleFetchSearchResults}>
                Lock Metrics & Fetch Search Results
              </button>
            </>
          )}
          {searchState === SearchVal.dataAvailable && isMetricsLocked && (
            <>
              <NonEditableMetrics metrics={metrics} />
              <button className="search-button" onClick={handleFetchSearchResults}>
                Fetch Search Results
              </button>
            </>
          )}
          {searchState === SearchVal.loading && <LoadingSpinner />}
          {searchState === SearchVal.noSearch && <SearchText />}
          {searchState === SearchVal.dataAvailable && data && (
            <PatentList
              items={data}
              metrics={metrics}
              search={patentQuery}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
