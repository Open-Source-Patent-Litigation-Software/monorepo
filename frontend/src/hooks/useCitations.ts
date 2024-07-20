import { useState } from 'react';
import { Dictionary } from "@/utils/dictionary";
import { fetchCitation } from "@/utils/fetchCitations";

export const useCitations = (itemUrl: string, metrics: string[]) => {
    const [citationsLoading, setCitationsLoading] = useState<boolean>(false);
    const [citationsData, setCitationsData] = useState<Dictionary>({});
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if(Object.keys(citationsData).length === 0) {
            fetchCitation(
                metrics,
                itemUrl,
                setCitationsData,
                setCitationsLoading
            );
        }
        setSelectedMetric(value);
    };

    return {
        citationsLoading,
        citationsData,
        selectedMetric,
        handleDropdownChange
    };
};
