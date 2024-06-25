import { useState } from 'react';
import { Metric, PatentItem, backendUrl } from "@/types/types";

interface UseFetchMetricsReturn {
  searchResults: PatentItem[] | null;
  error: string;
  metrics: Metric[];
  isMetricsLocked: boolean;
  isLoading: boolean;
  fetchMetrics: (patentQuery: string) => Promise<void>;
  lockMetricsAndSearch: (metrics: string[]) => Promise<void>;
  addMetric: () => void;
  removeMetric: (index: number) => void;
  editMetric: (index: number, newValue: string) => void;
  unlockMetrics: () => void;
}

export const useFetchMetrics = (): UseFetchMetricsReturn => {
  const [searchResults, setSearchResults] = useState<PatentItem[] | null>(null);
  const [error, setError] = useState<string>("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      setIsLoading(true);

      const response = await fetch('/api/metrics', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
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
      setIsLoading(false);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setIsLoading(false);
    }
  };  

  const unlockMetrics = () => {
    setIsMetricsLocked(false);
    setSearchResults(null);
  }

  const lockMetricsAndSearch = async (metrics: string[]) => {
    setIsMetricsLocked(true);
    setIsLoading(true);
    try {
        setError("");
        const metricsString = metrics.join("\n");

        const response = await fetch('/api/search', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ metricsString }),
        });
        
        if (!response.ok) {
          console.log(response);
          console.log("test");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const searchData = await response.json();
        setSearchResults(searchData.results);
        setIsLoading(false);
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        setSearchResults(null);
        setIsLoading(false);
      }
  };

  return {
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
  };
};
