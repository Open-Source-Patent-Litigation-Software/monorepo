import { useState } from "react";

export const useSummary = (patentURL: string) => {
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");

    const getSummary = async () => {
        // set the summary loading
        setSummaryLoading(true);

        try {

            const summaryJSON = {
                user: "TEMP_VAL", // Temporary user value
                patentURL: patentURL, // Patent item URL
            };

            const requestParameters = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(summaryJSON), // Convert the JSON payload to a string
            };
            // Make the fetch call to the backend API
            const summaryResponse = await fetch(
                '/api/summary',
                requestParameters
            );

            const summaryData = await summaryResponse.json();
            setSummary(summaryData["summary"]);
        } catch(error) {
            console.log(error);
        } finally {
            // finally set loading to false
            setSummaryLoading(false);
        }
    };

    return {
        summaryLoading,
        summary,
        getSummary
    }
};
