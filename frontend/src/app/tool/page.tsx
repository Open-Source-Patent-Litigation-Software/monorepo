"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../_components/navbar/navbar";
import { Footer } from "../_components/footer/footer";
import Metrics from "./_components/metrics/metrics";
import PatentList from "./_components/patentList/patentList";
import SearchText from "./_components/search/searchText";
import LoadingSpinner from "./_components/search/loadingSpinner";
import useMetricSearchStateStore from "@/app/_stores/useMetricStore";

/*
 >>> TODO: Jun 5th
    >>> Add use effect to the zuztand store above
    >>> Create drop down with all items in the store
    >>> Adjust citations component to render only items shown
*/
import {
  SearchContainer,
  ColoredDiv,
  SearchTextArea,
  SearchButton,
  SearchBarTitle,
  AnimationContainer,
} from "./styles";
interface Error {
  message: string;
}

enum SearchVal {
  loading = 1,
  noSearch = 0,
  dataAvailable = 2,
}

function Index() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [patentQuery, setPatentQuery] = useState("");
  const [backendUrl, setBackendUrl] = useState(
    process.env.NEXT_PUBLIC_DEV_BACKEND
  );
  const { storeMetrics, setAll } = useMetricSearchStateStore();
  const [metrics, setMetrics] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean[]>([]);
  const [searchState, setSearchState] = useState<SearchVal>(SearchVal.noSearch);

  const addMetric = () => {
    if (metrics.length >= 10) return;
    setMetrics([...metrics, ""]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
    setIsEditing(isEditing.filter((_, i) => i !== index));
  };

  const editMetric = (index: number, newValue: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = newValue;
    setMetrics(newMetrics);
  };

  const fetchData = async () => {
    try {
      // set loading animation
      setSearchState(SearchVal.loading);

      // if there is data, reset Data to clear all state below
      if (data) setData(null);

      // if there are metrics, reset the metrics
      if (metrics.length > 0) setMetrics([]);

      // Append the patentQuery as a query parameter
      const searchURL = new URL(`${backendUrl}/patents/makeQuery`);
      searchURL.searchParams.append("search", patentQuery);
      const searchResponse = await fetch(searchURL.toString());
      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      setData(searchData.results);

      const formattedSearch = {
        query: patentQuery, // Convert the data to a JSON string and wrap it in "query"
      };

      // This part gets the metrics
      const metricsURL = new URL(`${backendUrl}/llm/obtainMetrics`);

      // construct the POST request
      const metricsResponse = await fetch(metricsURL.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedSearch),
      });

      // throw an error if this doesnt work
      if (!metricsResponse.ok) {
        throw new Error(`HTTP error! status: ${metricsResponse.status}`);
      }

      const metricsData = await metricsResponse.json();
      const metricList: string[] = Object.values(metricsData);
      setMetrics(metricList);

      // after all data is loaded, display the data
      setSearchState(SearchVal.dataAvailable);

      setError("");
    } catch (e) {
      // if there is an error, reset everything and display the error
      setSearchState(SearchVal.noSearch);
      setMetrics([]);
      const error = e as Error;
      setError(error.message);
      setData(null);
    }
  };

  return (
    <>
      <ColoredDiv>
        <Navbar />
        <AnimationContainer>
          <SearchContainer>
            <SearchBarTitle>Search Patents</SearchBarTitle>
            <SearchTextArea
              onChange={(e) => setPatentQuery(e.target.value)}
              placeholder="Describe your invention in 500 words or less."
            />
            <SearchButton onClick={fetchData}>Search</SearchButton>
            {error && <div>Error: {error}</div>}
          </SearchContainer>
          {(() => {
            if (searchState == SearchVal.dataAvailable && data) {
              return (
                <>
                  <Metrics
                    metrics={metrics}
                    addMetric={addMetric}
                    editMetric={editMetric}
                    removeMetric={removeMetric}
                  />
                  <PatentList
                    items={data}
                    metrics={metrics}
                    search={patentQuery}
                  />
                </>
              );
            } else if (searchState == SearchVal.loading) {
              return <LoadingSpinner />;
            } else {
              return <SearchText />;
            }
          })()}
        </AnimationContainer>
      </ColoredDiv>
      <Footer />
    </>
  );
}

export default Index;
