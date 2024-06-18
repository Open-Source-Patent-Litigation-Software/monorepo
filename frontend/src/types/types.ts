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
    score: number;
    snippet: null | string; // Assuming snippet can be null or string
    title: string;
    type: string;
    www_link: string;
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
