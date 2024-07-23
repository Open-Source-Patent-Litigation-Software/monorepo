import { useState } from 'react';
import { Metric, PatentItem, backendUrl } from "@/types/types";

interface UseFetchMetricsReturn {
  searchResults: PatentItem[] | null;
  error: string;
  metrics: Metric[];
  isMetricsLocked: boolean;
  isLoading: boolean;
  fetchMetrics: (patentQuery: string) => Promise<void>;
  lockMetricsAndSearch: (metrics: string[], threshold: number, numPatents: number) => Promise<void>;
  addMetric: () => void;
  removeMetric: (index: number) => void;
  editMetric: (index: number, newValue: string) => void;
  unlockMetrics: () => void;
}

export const useFetchMetrics = () => {
  const [searchResults, setSearchResults] = useState<PatentItem[] | null>(null);
  const [error, setError] = useState<string>("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isMetricsLocked, setIsMetricsLocked] = useState<boolean>(false);

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
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const metricsData = await response.json();
      const metricList: Metric[] = Object.values(metricsData["functions"]);
      setMetrics(metricList);
      setMetricsLoading(false);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setMetricsLoading(false);
    }
  };  

  const unlockMetrics = () => {
    setIsMetricsLocked(false);
    setSearchResults(null);
  }

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
          console.log(response);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const searchData = await response.json();
        setSearchResults(searchData);
        setSearchLoading(false);
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        setSearchResults(null);
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
    setSearchResults
  };
};
