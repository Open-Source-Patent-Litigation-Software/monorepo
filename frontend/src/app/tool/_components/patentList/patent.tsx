import React, { useState } from "react";
import CustomButton from "./CustomButton";

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
import { mockData } from "../citations/mockData";
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
  const [citationsData, setCitationsData] = useState(null);
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

  // function to define metric dropdown changes
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMetric(event.target.value);
    console.log(event.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const concatMetrics = concatenateWithComma(searchMetrics);
      const formattedSearch = {
        search: search,
        user: "user",
        patentURL: item.www_link,
        metrics_str: concatMetrics,
      };

      const metricsURL = new URL(
        `${backendUrl}/llm/extractSpecificPatentMetrics`
      );
      const metricsResponse = await fetch(metricsURL.toString(), {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify(formattedSearch), // Convert data to JSON string
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

      const citationsSearch = {
        user: "user",
        patentURL: item.www_link,
        metrics_str: concatMetrics,
      };

      const citationsURL = new URL(`${backendUrl}/llm/getCitations`);
      const citationsResponse = await fetch(citationsURL.toString(), {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify(formattedSearch), // Convert data to JSON string
      });

      if (!citationsResponse.ok) {
        throw new Error(`HTTP error! status: ${citationsResponse.status}`);
      }
      const citationData = await citationsResponse.json();
      console.log(citationData);
      setCitationsData(citationData);
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
          <div>
            <ChartContainer>
              <Radar data={data} />
            </ChartContainer>
            <div>
              {/*Drop down component goes here*/}
              <label>Drop Down</label>
              <select onChange={handleDropdownChange}>
                <option value="" disabled>
                  Select a Metric to Analyze
                </option>
                {searchMetrics.map((metric) => (
                  <option key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </div>
            <Citations data={mockData} metric={selectedMetric || ""} />
          </div>
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
