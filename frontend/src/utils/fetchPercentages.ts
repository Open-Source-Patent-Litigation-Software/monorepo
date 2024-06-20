import { concateMetrics } from "./utils";
import { backendUrl } from "@/types/types";

export const fetchPercentages = async (
    searchMetrics: string[],
    search: string,
    itemUrl: string,
    setData: React.Dispatch<
    React.SetStateAction<{
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
    }>
    >,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAnalyzed: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        const concatMetrics = concateMetrics(searchMetrics);
        const formattedSearch = {
            searchQuery: search,
            user: "user",
            patentURL: itemUrl,
            metrics: concatMetrics,
        };
        const metricsURL = new URL(
            `${backendUrl}/llm/extractSpecificPatentMetrics`
        );
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
    
        setData({
            labels: Object.keys(metricsData["data"]),
            datasets: [
            {
                label: "% similar",
                data: Object.values(metricsData["data"]),
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                pointBackgroundColor: "rgb(54, 162, 235)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(54, 162, 235)",
            },
            ],
        });
    
        setIsAnalyzed(true);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  };