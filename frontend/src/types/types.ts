export const backendUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

interface DifScore {
    total: number;
    scores: number[];
}

export interface PatentItem {
    abstract: string;
    alias: string;
    id: string;
    image: string;
    index: string;
    inventors: string[];
    mapping: null; // Assuming no further details are available
    owner: string;
    publication_date: string;
    publication_id: string;
    snippet: null | string; // Assuming snippet can be null or string
    title: string;
    type: string;
    www_link: string;
    score: DifScore;
}

export interface PatentListProps {
    items: PatentItem[];
    metrics: string[];
    search: string;
}

export interface PatentProps {
    item: PatentItem;
    searchMetrics: string[];
    search: string;
}

export interface PatentChartProps {
data: {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        backgroundColor: string;
        borderColor: string;
        pointBackgroundColor: string;
        pointBorderColor: string;
        pointHoverBackgroundColor: string;
        pointHoverBorderColor: string;
    }[];
    };
}

export interface MetricDropdownProps {
    searchMetrics: string[];
    selectedMetric: string | null;
    handleDropdownChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface MetricProps {
    metrics: string[];
    addMetric: () => void;
    removeMetric: (index: number) => void;
    editMetric: (index: number, newMetric: string) => void;
    lockMetrics: () => void;
}

type Dataset = {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
};

// Define the type for the percentages data
export type PercentagesDataType = {
    labels: string[];
    datasets: Dataset[];
};

export type Metric = string;

export interface SearchResult {
  // Define the structure of your search result
}

export interface FormattedSearch {
    searchQuery: string;
    user: string;
}

export interface Error {
    message: string;
}

export enum PatentSearchVal {
    loading = 1,
    noSearch = 0,
    dataAvailable = 2,
}

export type patentbyID = {
    publicationNumber: string,
    title: string,
    assignee: string,
    applicationDate: string,
    status: string,
    summary: string,
}