// File: hooks/useSearchMetrics.ts

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
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

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
  }

  const fetchPatentInstances = useCallback(async () => {
    if (dynamoInstanceIds.length === 0) return;

    try {
      const response = await fetch('/api/getPatentInstance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: "google-oauth2|108809862173138748904",
          instance_ids: dynamoInstanceIds
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Response && data.Response.length > 0) {
        setSearchResults(data.Response);
        setSearchLoading(false);
        // Stop polling once we have results
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
    } catch (e) {
      const error = e as Error;
      setError(error.message);
    }
  }, [dynamoInstanceIds, pollingInterval]);

  useEffect(() => {
    if (dynamoInstanceIds.length > 0 && !pollingInterval) {
      const interval = setInterval(fetchPatentInstances, 5000); // Poll every 5 seconds
      setPollingInterval(interval);
  
      // Set a timeout to stop polling after 2 minutes
      const timeoutId = setTimeout(() => {
        clearInterval(interval);
        setPollingInterval(null);
        setSearchLoading(false);
        setError("Polling timed out after 2 minutes. Please try again.");
      }, 120000); // 2 minutes in milliseconds
  
      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
      };
    }
  }, [dynamoInstanceIds, fetchPatentInstances, pollingInterval]);

  const lockMetricsAndSearch = async (metrics: string[], threshold: number, numPatents: number) => {
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
      console.log("dynamoInstanceIds:", data);
      setDynamoInstanceIds(data.dynamoInstanceIds);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setSearchResults(null);
      setIsMetricsLocked(false);
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