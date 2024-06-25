import { useState } from 'react';
import { fetchPercentages } from "@/utils/fetchPercentages";
import { PercentagesDataType } from '@/types/types';

export const useFetchPercentages = (
    searchMetrics: string[],
    search: string,
    itemUrl: string,
) => {
    const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [percentagesData, setpercentagesData] = useState<PercentagesDataType>({
        labels: ["Running", "Swimming", "Eating", "Cycling"],
        datasets: [
            {
                label: "My First Dataset",
                data: [20, 10, 4, 2],
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(255, 99, 132)",
            },
        ],
    });

    const fetchPercentagesHandler = () => {
        fetchPercentages(
        searchMetrics,
        search,
        itemUrl,
        setpercentagesData,
        setLoading,
        setIsAnalyzed
        );
    };

    return {
        isAnalyzed,
        loading,
        percentagesData,
        fetchPercentagesHandler
    };
};
