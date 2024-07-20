import React from "react";
import CustomButton from "../../../../_components/buttons/CustomButton";
import Citations from "../citations/Citations";
import PatentChart from "./components/patentChart";
import "./patent.css";
import { PatentProps } from "@/types/types";
import MetricDropdown from "./components/metricDropdown";
import { useCitations } from "@/hooks/useCitations";
import { useSavePatents } from "@/hooks/useSavePatents";
import { useSummary } from "@/hooks/useSummary";
import SummaryComponent from "./components/summary";

const Patent: React.FC<PatentProps> = ({ item, searchMetrics, search }) => {
  const {
    citationsLoading,
    citationsData,
    selectedMetric,
    handleDropdownChange,
  } = useCitations(item.www_link, searchMetrics);

  const graphData = {
    labels: searchMetrics,
    datasets: [
        {
            label: "Differential Score",
            data: item.score.scores,
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
        },
    ],
}

  const { summary, summaryLoading, getSummary } = useSummary(item.www_link);

  const { savePatentHandler, saveLoading, isSaved } = useSavePatents(
    item,
    search,
    citationsData,
    summary
  );

  return (
    <div className="patent-box" key={item.id}>
      <h2 className="box-title">
        {item.title} ({item.type})
      </h2>
      <p className="abstract">
        <span className="bolded-detail">Abstract: </span> {item.abstract}
      </p>
      <p className="details">
        <span className="bolded-detail">Owned by:</span> {item.owner}
      </p>
      <p className="details">
        <span className="bolded-detail">Publication Date:</span>{" "}
        {item.publication_date}
      </p>
      <p className="details">
        <span className="bolded-detail">Patent Number:</span>{" "}
        {item.publication_id}
      </p>
      <p className="details">
        <span className="bolded-detail">Score:</span> {item.score.total}
      </p>
      <a
        className="patent-link"
        href={item.www_link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Patents Link
      </a>
      {item.inventors && (
        <ul className="inventor-list">
          {item.inventors.map((inventor) => (
            <li className="inventor-item" key={inventor}>
              {inventor}
            </li>
          ))}
        </ul>
      )}
      <SummaryComponent
        summary={summary}
        summaryLoading={summaryLoading}
        getSummary={getSummary}
      />

      <div className="wrapper">
          <div className="analyzed-content-wrapper">
            <div className="chart-container">
              <PatentChart data={graphData} />
            </div>
            <MetricDropdown
              searchMetrics={searchMetrics}
              selectedMetric={selectedMetric}
              handleDropdownChange={handleDropdownChange}
            />
            {selectedMetric ? (
              <Citations
                data={citationsData}
                metric={selectedMetric || ""}
                loading={!citationsData[selectedMetric]}
              />
            ) : (
              <div className="no-metric-selected">No Metric Selected</div>
            )}
            {isSaved ? (
              <div className="saved-message">Patent Saved Successfully!</div>
            ) : (
              <CustomButton
                loading={saveLoading}
                handleClick={async () => {
                  await savePatentHandler();
                }}
              >
                Save Patent
              </CustomButton>
            )}
          </div>
      </div>
    </div>
  );
};

export default Patent;
