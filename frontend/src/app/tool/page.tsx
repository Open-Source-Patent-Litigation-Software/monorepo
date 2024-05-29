"use client";
import React, { useState } from "react";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
import Metrics from "./components/metrics/metrics";
import PatentList from "./components/patentList/patentList";
import styled from 'styled-components';

import {
  SearchContainer,
  ColoredDiv,
  SearchTextArea,
  SearchButton,
  SearchBarTitle,
  AnimationContainer,
  MetricsContainer,
  MetricsTitleContainer,
} from "./styles";
interface Error {
  message: string;
}

function Index() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [patentQuery, setPatentQuery] = useState("");
  const [backendUrl, setBackendUrl] = useState(
    process.env.NEXT_PUBLIC_DEV_BACKEND
  );
  const [metrics, setMetrics] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addMetric = () => {
    if(metrics.length >= 10) return;
    setMetrics([...metrics, '']);
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

  const

  const fetchData = async () => {
    try {
      // Append the patentQuery as a query parameter
      const searchURL = new URL(`${backendUrl}/patents/makeQuery`);
      searchURL.searchParams.append("search", patentQuery);
      const searchResponse = await fetch(searchURL.toString());
      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      setData(searchData.results);
      console.log(searchData);

      const formattedSearch = {
        query: patentQuery, // Convert the data to a JSON string and wrap it in "query"
      };

      // This part gets the metrics
      const metricsURL = new URL(`${backendUrl}/llm/obtainMetrics`);
      console.log(metricsURL);
      const metricsResponse = await fetch(metricsURL.toString(), {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(formattedSearch), // Convert data to JSON string
      });
      if (!metricsResponse.ok) {
        throw new Error(`HTTP error! status: ${metricsResponse.status}`);
      }
      const metricsData = await metricsResponse.json();
      const metricList: string[] = Object.values(metricsData);
      setMetrics(metricList);
      console.log(metricsData);
      setError("");
    } catch (e) {
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
            if (data) {
              return (
                <>
                  <Metrics metrics={metrics} addMetric={addMetric} editMetric={editMetric} removeMetric={removeMetric}/>
                  <PatentList items={data} metrics={metrics} search={patentQuery}/>
                </>
                
            );
            } else {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "50%",
                    textAlign: "center",
                    justifyItems: "center",
                    margin: "auto",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  What makes a good search? A good search query is around 500
                  words and details all the key inventive features of your idea.
                  <br />
                  <br />
                  We break your search into many categories so we can properly
                  analyze it. How does the search work? We use three specialized
                  artificial intelligence models to break down your search query
                  into categories and then analyze the patent landscape.
                </div>
              );
            }
          })()}
        </AnimationContainer>
      </ColoredDiv>
      <Footer />
    </>
  );
}

export default Index;
