import { useState, useEffect, useCallback } from "react";
import { PercentagesDataType } from "@/types/types";
import { PatentItem } from "@/types/types";
import { useUser } from "@auth0/nextjs-auth0/client";
export const useSavePatents = (
    genericInfo: PatentItem,
    search: string,
    percentages: PercentagesDataType,
    citations: any, // Using 'any' for flexibility with citation data
    summary: string
) => {

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { user, error, isLoading } = useUser();

    const getPatentCall = async (patentJSON: any) => {
        try {
            const response = await fetch('retrieve_saved_patent', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patentJSON),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (e) {
            const error = e as Error;
            console.error(error.message);
        }
    };

    const parsePercentages = useCallback(
        (percentages: PercentagesDataType): { [key: string]: any } => {
            const percentagesJSON: { [key: string]: any } = {};
            const metricPercentages = percentages.datasets[0].data;
            const metricLabels = percentages.labels;

            metricLabels.forEach((label, index) => {
                percentagesJSON[label] = metricPercentages[index];
            });

            return percentagesJSON;
        },
        []
    );

    const parseCitations = useCallback(
        (citations: any): { [key: string]: any } => {
            const citationJSON: { [key: string]: any } = {};

            Object.keys(citations).forEach((citationKey) => {
                citationJSON[citationKey] = {};

                Object.keys(citations[citationKey]).forEach((sectionKey) => {
                    citationJSON[citationKey][sectionKey] =
                        citations[citationKey][sectionKey];
                });
            });

            return citationJSON;
        },
        []
    );

    const savePatentHandler = useCallback(async () => {
        setSaveLoading(true);

        const patentJSON = {
            patentInfo: genericInfo,
            search: search,
            summary: summary,
            percentages: parsePercentages(percentages),
            citations: parseCitations(citations),
        };
        console.log(patentJSON);
        await savePatent(patentJSON);

        setSaveLoading(false);
        setIsSaved(true);
    }, [
        genericInfo,
        search,
        percentages,
        citations,
        parsePercentages,
        parseCitations, ,
        summary
    ]);

    useEffect(() => {
        if (Object.keys(citations).length > 0) {
            savePatentHandler();
        }
    }, [citations, savePatentHandler]);

    return { savePatentHandler, saveLoading, isSaved };
};
