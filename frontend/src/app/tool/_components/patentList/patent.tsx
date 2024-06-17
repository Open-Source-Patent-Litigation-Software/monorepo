import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { Dictionary } from "@/app/_utils/dictionary";
import {
  PatentBox,
  BoxTitle,
  Abstract,
  Details,
  PatentLink,
  InventorList,
  InventorItem,
  BoldedDetail,
  Wrapper,
  ChartContainer,
  DropdownContainer,
  DropdownLabel,
  DropdownSelect,
  DropdownOption,
  NoMetricSelected,
  AnalyzedContentWrapper,
} from "./styles";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import Citations from "../citations/Citations";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PatentItem {
  abstract: string;
  alias: string;
  id: string;
  image: string;
  index: string;
  inventors: string[];
  mapping: null; // Assuming no further details are available
  owner: string;
  publication_date: string;
  publication_id: string;
  score: number;
  snippet: null | string; // Assuming snippet can be null or string
  title: string;
  type: string;
  www_link: string;
}

interface PatentListProps {
  item: PatentItem;
  searchMetrics: string[];
  search: string;
}

function concatenateWithComma(list: string[]): string {
  return list.join("%_");
}

// PatentList component definition
const Patent: React.FC<PatentListProps> = ({ item, searchMetrics, search }) => {
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState(
    process.env.NEXT_PUBLIC_DEV_BACKEND
  );
  const [citationsLoading, setCitationsLoading] = useState<boolean>(false);
  const [citationsData, setCitationsData] = useState<Dictionary>({});
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [data, setData] = useState({
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

  const citationCache: { [key: string]: string } = {};

  const addCitation = (metric: string, data: string) => {
    setCitationsData((prevCitations) => ({
      ...prevCitations,
      [metric]: data,
    }));
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedMetric(value);
    if (value && !citationsData[value]) {
      fetchCitation(value);
    }
  };

  const fetchCitation = async (metric: string) => {
    if (citationCache[metric]) {
      addCitation(metric, citationCache[metric]);
      return;
    }

    setCitationsLoading(true);
    try {
      const citationURL = new URL(`${backendUrl}/llm/getCitation`);
      const citationJSON = {
        user: "TEMP_VAL",
        patentURL: item.www_link,
        metric: metric,
      };
      const requestParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citationJSON),
      };
      const citationResponse = await fetch(
        citationURL.toString(),
        requestParameters
      );

      if (!citationResponse.ok) {
        throw new Error(`HTTP error! status: ${citationResponse.status}`);
      }

      const citationData = await citationResponse.json();
      citationCache[metric] = citationData;
      addCitation(metric, citationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setCitationsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const concatMetrics = concatenateWithComma(searchMetrics);
      const formattedSearch = {
        searchQuery: search,
        user: "user",
        patentURL: item.www_link,
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

  return (
    <PatentBox key={item.id}>
      <BoxTitle>
        {item.title} ({item.type})
      </BoxTitle>
      <Abstract>{item.abstract}</Abstract>
      <Details>
        <BoldedDetail>Owned by:</BoldedDetail> {item.owner}
      </Details>
      <Details>
        <BoldedDetail>Publication Date:</BoldedDetail> {item.publication_date}
      </Details>
      <Details>
        <BoldedDetail>Patent Number:</BoldedDetail> {item.publication_id}
      </Details>
      <PatentLink
        href={item.www_link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Patents Link
      </PatentLink>
      {item.inventors && (
        <InventorList>
          {item.inventors.map((inventor) => (
            <InventorItem key={inventor}>{inventor}</InventorItem>
          ))}
        </InventorList>
      )}
      <Wrapper>
        {isAnalyzed ? (
          <AnalyzedContentWrapper>
            <ChartContainer>
              <Radar data={data} />
            </ChartContainer>
            <DropdownContainer>
              <DropdownLabel>Drop Down</DropdownLabel>
              <DropdownSelect
                onChange={handleDropdownChange}
                value={selectedMetric || ""}
              >
                <DropdownOption value="" disabled>
                  Select a Metric to Analyze
                </DropdownOption>
                {searchMetrics.map((metric) => (
                  <DropdownOption key={metric} value={metric}>
                    {metric}
                  </DropdownOption>
                ))}
              </DropdownSelect>
            </DropdownContainer>
            {selectedMetric ? (
              <Citations
                data={citationsData}
                metric={selectedMetric || ""}
                loading={!citationsData[selectedMetric]}
              />
            ) : (
              <NoMetricSelected>No Metric Selected</NoMetricSelected>
            )}
          </AnalyzedContentWrapper>
        ) : (
          <CustomButton loading={loading} handleClick={fetchData}>
            Analyze
          </CustomButton>
        )}
      </Wrapper>
    </PatentBox>
  );
};

export default Patent;
