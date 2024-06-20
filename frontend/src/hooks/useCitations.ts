import { useState } from 'react';
import { Dictionary } from "@/utils/dictionary";
import { fetchCitation } from "@/utils/fetchCitations";
import { backendUrl } from '@/types/types';

export const useCitations = (itemUrl: string) => {
    const [citationsLoading, setCitationsLoading] = useState<boolean>(false);
    const [citationsData, setCitationsData] = useState<Dictionary>({});
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const citationCache: { [key: string]: string } = {};

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedMetric(value);
        if (value && !citationsData[value]) {
        fetchCitation(
            value,
            itemUrl,
            citationCache,
            setCitationsData,
            setCitationsLoading
        );
        }
    };

    return {
        citationsLoading,
        citationsData,
        selectedMetric,
        handleDropdownChange
    };
};
