import { useState } from 'react';
import { Metric, PatentItem, FormattedSearch, SearchVal } from "@/types/types";

interface UseFetchMetricsReturn {
  data: PatentItem[] | null;
  error: string;
  metrics: Metric[];
  isMetricsLocked: boolean;
  searchState: SearchVal;
  fetchMetrics: (patentQuery: string, backendUrl: string | undefined) => Promise<void>;
  lockMetricsAndSearch: (patentQuery: string, backendUrl: string | undefined) => Promise<void>;
  addMetric: () => void;
  removeMetric: (index: number) => void;
  editMetric: (index: number, newValue: string) => void;
}

export const useFetchMetrics = (): UseFetchMetricsReturn => {
  const [data, setData] = useState<PatentItem[] | null>(null);
  const [error, setError] = useState<string>("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [searchState, setSearchState] = useState<SearchVal>(SearchVal.noSearch);
  const [isMetricsLocked, setIsMetricsLocked] = useState<boolean>(false);

  const addMetric = () => {
    if (metrics.length >= 10 || isMetricsLocked) return;
    setMetrics([...metrics, ""]);
  };

  const removeMetric = (index: number) => {
    if (isMetricsLocked) return;
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const editMetric = (index: number, newValue: string) => {
    if (isMetricsLocked) return;
    const newMetrics = [...metrics];
    newMetrics[index] = newValue;
    setMetrics(newMetrics);
  };

  const fetchMetrics = async (patentQuery: string, backendUrl: string | undefined) => {
    try {
      setSearchState(SearchVal.loading);
      setError("");

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

      setSearchState(SearchVal.dataAvailable);
    } catch (e) {
      setSearchState(SearchVal.noSearch);
      const error = e as Error;
      setError(error.message);
    }
  };

  const lockMetricsAndSearch = async (patentQuery: string, backendUrl: string | undefined) => {
    setIsMetricsLocked(true);
    try {
        setSearchState(SearchVal.loading);
        setError("");
  
        const searchURL = new URL(`${backendUrl}/patents/makeQuery`);
        searchURL.searchParams.append("search", patentQuery);
        const searchResponse = await fetch(searchURL.toString());
        if (!searchResponse.ok) {
          throw new Error(`HTTP error! status: ${searchResponse.status}`);
        }
        const searchData = await searchResponse.json();
        setData(searchData.results);
  
        setSearchState(SearchVal.dataAvailable);
      } catch (e) {
        setSearchState(SearchVal.noSearch);
        const error = e as Error;
        setError(error.message);
        setData(null);
      }
  };

  return {
    data,
    error,
    metrics,
    isMetricsLocked,
    searchState,
    fetchMetrics,
    lockMetricsAndSearch,
    addMetric,
    removeMetric,
    editMetric
  };
};
