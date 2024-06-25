import { useState, useEffect, useCallback } from "react";
import { PercentagesDataType } from "@/types/types";

export const useSavePatents = (
  search: string,
  patentNum: string,
  percentages: PercentagesDataType,
  citations: any // Using 'any' for flexibility with citation data
) => {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

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
      search: search,
      patentNum: patentNum,
      percentages: parsePercentages(percentages),
      citations: parseCitations(citations),
    };

    const finalJSON = JSON.stringify(patentJSON);
    console.log(finalJSON);

    // TODO: IMPLEMENT POST REQUEST TO SAVE PATENT DATA

    setSaveLoading(false);
    setIsSaved(true);
  }, [
    search,
    patentNum,
    percentages,
    citations,
    parsePercentages,
    parseCitations,
  ]);

  useEffect(() => {
    if (Object.keys(citations).length > 0) {
      savePatentHandler();
    }
  }, [citations, savePatentHandler]);

  return { savePatentHandler, saveLoading, isSaved };
};