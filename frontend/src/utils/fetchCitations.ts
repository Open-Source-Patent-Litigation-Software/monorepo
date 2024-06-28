import { Dictionary } from "@/utils/dictionary";
import { backendUrl } from "@/types/types";
import { fetchAuthToken } from "./fetchAuthToken";

// Function to fetch citation data
export const fetchCitation = async (
    metric: string, // The metric for which the citation is being fetched
    itemUrl: string, // URL of the patent item
    citationCache: { [key: string]: string }, // Cache for citations to avoid redundant API calls
    setCitationsData: React.Dispatch<React.SetStateAction<Dictionary>>, // State setter function to update citation data
    setCitationsLoading: React.Dispatch<React.SetStateAction<boolean>> // State setter function to update loading state
) => {
    // Check if the citation data for the given metric is already cached
    if (citationCache[metric]) {
        // If cached, update the citation data state with the cached data
        setCitationsData((prevCitations) => ({
                ...prevCitations,
                [metric]: citationCache[metric],
            }));
      return; // Exit the function as data is already available
    }

    // Set loading state to true as the API call is about to be made
    setCitationsLoading(true);
    try {
        // Construct the API URL for fetching the citation
        const citationURL = '/api/citations';
        // Prepare the JSON payload for the API request
        const citationJSON = {
            user: "TEMP_VAL", // Temporary user value
            patentURL: itemUrl, // Patent item URL
            metric: metric, // Metric for which citation is requested
        };
        // Define the request parameters for the fetch call
        const requestParameters = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(citationJSON), // Convert the JSON payload to a string
        };
        // Make the fetch call to the backend API
        const citationResponse = await fetch(
            citationURL,
            requestParameters
        );

        // Check if the response status is not OK (i.e., not in the range 200-299)
        if (!citationResponse.ok) {
            throw new Error(`HTTP error! status: ${citationResponse.status}`);
        }

        // Parse the JSON response from the API
        const citationData = await citationResponse.json();
        // Cache the fetched citation data
        citationCache[metric] = citationData;
        // Update the citation data state with the newly fetched data
        setCitationsData((prevCitations) => ({
            ...prevCitations,
            [metric]: citationData,
        }));
    } catch (error) {
        // Log any errors that occur during the fetch call
        console.error("Error fetching data:", error);
    } finally {
        // Set loading state to false as the API call has completed
        setCitationsLoading(false);
    }
};
