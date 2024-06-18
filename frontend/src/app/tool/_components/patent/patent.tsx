import React, { useState } from "react";
import CustomButton from "../../../../components/buttons/CustomButton";
import { Dictionary } from "@/utils/dictionary";
import { Radar } from "react-chartjs-2";
import Citations from "../citations/Citations";
import "chart.js/auto";
import "./patent.css";

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
    <div className="patent-box" key={item.id}>
      <h2 className="box-title">
        {item.title} ({item.type})
      </h2>
      <p className="abstract">{item.abstract}</p>
      <p className="details">
        <span className="bolded-detail">Owned by:</span> {item.owner}
      </p>
      <p className="details">
        <span className="bolded-detail">Publication Date:</span> {item.publication_date}
      </p>
      <p className="details">
        <span className="bolded-detail">Patent Number:</span> {item.publication_id}
      </p>
      <a className="patent-link" href={item.www_link} target="_blank" rel="noopener noreferrer">
        Google Patents Link
      </a>
      {item.inventors && (
        <ul className="inventor-list">
          {item.inventors.map((inventor) => (
            <li className="inventor-item" key={inventor}>{inventor}</li>
          ))}
        </ul>
      )}
      <div className="wrapper">
        {isAnalyzed ? (
          <div className="analyzed-content-wrapper">
            <div className="chart-container">
              <Radar data={data} />
            </div>
            <div className="dropdown-container">
              <label className="dropdown-label">Drop Down</label>
              <select className="dropdown-select" onChange={handleDropdownChange} value={selectedMetric || ""}>
                <option className="dropdown-option" value="" disabled>
                  Select a Metric to Analyze
                </option>
                {searchMetrics.map((metric) => (
                  <option className="dropdown-option" key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </div>
            {selectedMetric ? (
              <Citations data={citationsData} metric={selectedMetric || ""} loading={!citationsData[selectedMetric]} />
            ) : (
              <div className="no-metric-selected">No Metric Selected</div>
            )}
          </div>
        ) : (
          <CustomButton loading={loading} handleClick={fetchData}>
            Analyze
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default Patent;
