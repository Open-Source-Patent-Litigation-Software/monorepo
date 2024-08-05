import { useState } from 'react';
import { Dictionary } from "@/utils/dictionary";
import { fetchCitation } from "@/utils/fetchCitations";

export const useCitations = (itemUrl: string, metrics: string[]) => {
    const [citationsLoading, setCitationsLoading] = useState<boolean>(false);
    const [citationsData, setCitationsData] = useState<Dictionary>({});
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    const handleDropdownChange = (
        event?: React.ChangeEvent<HTMLSelectElement>, 
        defaultValue?: string
    ) => {
        const value = event ? event.target.value : defaultValue;
        if (!value) return;

        if (Object.keys(citationsData).length === 0) {
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
