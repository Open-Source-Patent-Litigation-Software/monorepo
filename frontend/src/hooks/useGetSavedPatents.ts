import { useState, useEffect } from "react";
import { FetchedPatents } from "../app/saved/types";

export const useGetSavedPatents = (): { fetchedPatents: FetchedPatents | null } => {
    const [fetchedPatents, setFetchedPatents] = useState<FetchedPatents | null>(null);

    useEffect(() => {
        const fetchSavedPatents = async () => {
            try {
                const response = await fetch("/api/retrieve_saved_patent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({})
                });
                const data: FetchedPatents = await response.json();
                setFetchedPatents(data);
            } catch (error) {
                console.error("Error fetching saved patents:", error);
            }
        };

        fetchSavedPatents();
    }, []);

    return { fetchedPatents };
};
