import { useState } from 'react';
import { Metric, PatentItem, FormattedSearch, backendUrl } from "@/types/types";

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

      const metricsURL = new URL(`${backendUrl}/llm/obtainMetrics`);
      const formattedSearch: FormattedSearch = {
        searchQuery: patentQuery,
        user: "user",
      };
      const metricsResponse = await fetch(metricsURL.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedSearch),
      });

      if (!metricsResponse.ok) {
        throw new Error(`HTTP error! status: ${metricsResponse.status}`);
      }

      const metricsData = await metricsResponse.json();
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
  
        const searchURL = new URL(`${backendUrl}/patents/makeQuery`);
        searchURL.searchParams.append("search", metrics.join("\n"));
        const searchResponse = await fetch(searchURL.toString());
        if (!searchResponse.ok) {
          throw new Error(`HTTP error! status: ${searchResponse.status}`);
        }
        const searchData = await searchResponse.json();
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
