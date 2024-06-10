import { create } from "zustand";

interface MetricSearchState {
  storeMetrics: string[];
  setAll: (newState: Partial<MetricSearchState>) => void;
}

const useMetricSearchStateStore = create<MetricSearchState>((set) => ({
  storeMetrics: [],
  setAll: (newState) =>
    set((state) => ({
      ...state,
      ...newState,
    })),
}));

export default useMetricSearchStateStore;
