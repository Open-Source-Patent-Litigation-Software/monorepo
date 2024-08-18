import { useState, useEffect, useCallback } from 'react';
import { Metric, PatentItem } from "@/types/types";

export const useFetchMetrics = () => {
  const [searchResults, setSearchResults] = useState<PatentItem[] | null>(null);
  const [error, setError] = useState<string>("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isMetricsLocked, setIsMetricsLocked] = useState<boolean>(false);
  const [dynamoInstanceIds, setDynamoInstanceIds] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const addMetric = () => {
    if (metrics.length >= 10 || isMetricsLocked) return;
    setMetrics([...metrics, ""]);
  };

  const removeMetric = (index: number) => {
    if (isMetricsLocked || metrics.length <= 6) return;
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const editMetric = (index: number, newValue: string) => {
    if (isMetricsLocked) return;
    const newMetrics = [...metrics];
    newMetrics[index] = newValue;
    setMetrics(newMetrics);
  };

  const fetchMetrics = async (patentQuery: string) => {
    try {
      setError("");
      setMetricsLoading(true);
      setMetrics([]);
      setSearchResults(null);
      setIsMetricsLocked(false);

      const response = await fetch('/api/metrics', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patentQuery }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const metricsData = await response.json();
      const metricList: Metric[] = Object.values(metricsData["functions"]);
      setMetrics(metricList);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setMetricsLoading(false);
    }
  };  

  const unlockMetrics = () => {
    setIsMetricsLocked(false);
    setSearchResults(null);
    setDynamoInstanceIds([]);
    setIsPolling(false);
  }

  const fetchPatentInstances = useCallback(async () => {
    if (dynamoInstanceIds.length === 0) return;

    try {
      console.log("Polling for search results...");
      const response = await fetch('/api/searchPolling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instance_ids: dynamoInstanceIds
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();
      console.log("Polling Data:", responseBody);
      
      if (responseBody.data !== null) {
        setSearchResults(responseBody.data);
        setSearchLoading(false);
        setIsPolling(false);
      }
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setIsPolling(false);
    }
  }, [dynamoInstanceIds]);

  useEffect(() => {
    console.log("dynamoInstanceIds changed:", dynamoInstanceIds);
    if (dynamoInstanceIds.length > 0 && !isPolling) {
      console.log("Starting polling");
      setIsPolling(true);
    }
  }, [dynamoInstanceIds]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (isPolling) {
      console.log("Setting up polling interval");
      intervalId = setInterval(fetchPatentInstances, 5000); // Poll every 5 seconds

      // Set a timeout to stop polling after 2 minutes
      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setIsPolling(false);
        setSearchLoading(false);
        setError("Polling timed out after 2 minutes. Please try again.");
      }, 120000); // 2 minutes in milliseconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPolling, fetchPatentInstances]);

  const lockMetricsAndSearch = async (metrics: string[], threshold: number, numPatents: number) => {
    console.log("lockMetricsAndSearch called");
    setIsMetricsLocked(true);
    setSearchLoading(true);
    try {
      setError("");
      const metricsString = metrics.join("\n");

      const formattedSearch = {
        metrics: metricsString,
        threshold: threshold,
        numPatents: numPatents,
        user: "user",
      };

      const response = await fetch('/api/search', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedSearch),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Search API response:", data);
      console.log("dynamoInstanceIds:", data.dynamoInstanceIds);
      setDynamoInstanceIds(data.dynamoInstanceIds);
    } catch (e) {
      const error = e as Error;
      console.error("Error in lockMetricsAndSearch:", error);
      setError(error.message);
      setSearchResults(null);
      setIsMetricsLocked(false);
      setSearchLoading(false);
    }
  };

  return {
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
    setSearchResults,
  };
};