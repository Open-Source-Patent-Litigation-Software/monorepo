import React from "react";
import CustomButton from "../../../../components/buttons/CustomButton";
import Citations from "../citations/Citations";
import PatentChart from "./components/patentChart";
import "./patent.css";
import { PatentProps } from "@/types/types";
import MetricDropdown from "./components/metricDropdown";
import { useCitations } from "@/hooks/useCitations";
import { useFetchPercentages } from "@/hooks/usePercentages";

const Patent: React.FC<PatentProps> = ({ item, searchMetrics, search }) => {
  const backendUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;
  const { citationsLoading, citationsData, selectedMetric, handleDropdownChange } = useCitations(item.www_link);
  const { isAnalyzed, loading, percentagesData, fetchPercentagesHandler } = useFetchPercentages(
    searchMetrics,
    search,
    item.www_link,
  );

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
              <PatentChart data={percentagesData}/>
            </div>
            <MetricDropdown
              searchMetrics={searchMetrics}
              selectedMetric={selectedMetric}
              handleDropdownChange={handleDropdownChange}
            />
            {selectedMetric ? (
              <Citations data={citationsData} metric={selectedMetric || ""} loading={!citationsData[selectedMetric]} />
            ) : (
              <div className="no-metric-selected">No Metric Selected</div>
            )}
          </div>
        ) : (
          <CustomButton loading={loading} handleClick={fetchPercentagesHandler}>
            Analyze
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default Patent;
