import React, { useState } from "react";
import CustomButton from "../../../../_components/buttons/CustomButton";
import Citations from "../citations/Citations";
import PatentChart from "./components/patentChart";
import styles from "./Patent.module.css";
import { PatentProps } from "@/types/types";
import MetricDropdown from "./components/metricDropdown";
import { useCitations } from "@/hooks/useCitations";
import { useSavePatents } from "@/hooks/useSavePatents";
import { useSummary } from "@/hooks/useSummary";
import SummaryComponent from "./components/summary";
import Modal from "./components/modal";
import Metrics from "../metrics/metrics";
import { FaSave } from "react-icons/fa";
import { scales } from "chart.js";

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
  };

  const { summary, summaryLoading, getSummary } = useSummary(item.www_link);
  const { savePatentHandler, saveLoading, isSaved } = useSavePatents(
    item,
    search,
    citationsData,
    summary
  );

  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownExecuted, setDropdownExecuted] = useState(false);

  const handleSaveClick = async () => {
    if (!dropdownExecuted) {
      await handleDropdownChange(undefined, searchMetrics[0]); // Provide a default value if needed
      setDropdownExecuted(true);
    }
    await savePatentHandler();
  };

  return (
    <>
      <div className={styles.card} onClick={() => setIsModalOpen(true)}>
        <PatentChart data={graphData} />
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <span className={styles.score}>{item.score.total}</span>
          </div>
          
          <p className={styles.cardDetails}>
            <span className={styles.boldedDetail}>Patent Number:</span>{" "}
            <a
            className={styles.patentLink}
            href={item.www_link}
            target="_blank"
            rel="noopener noreferrer"
            >
              {item.publication_id}
            </a>
          </p>
          
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{item.title}</h2>
              <div className={styles.iconContainer}>
                {isSaved ? (
                  <div className={styles.savedMessage}>Patent Saved Successfully!</div>
                ) : (
                  <CustomButton
                    loading={saveLoading}
                    handleClick={handleSaveClick}
                  >
                    Save Patent
                  </CustomButton>
                )}
                <span className={styles.modalScore}>{item.score.total}</span>
              </div>
              
            </div>
            <div className={styles.abstract}>
              <span className={styles.boldedDetail}>Abstract: </span>
              {isAbstractExpanded ? (
                <p>{item.abstract}</p>
              ) : (
                <p>{item.abstract.slice(0, 100)}...</p>
              )}
              <button
                className={styles.expandButton}
                onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
              >
                {isAbstractExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
            <p className={styles.details}>
              <span className={styles.boldedDetail}>Owned by:</span> {item.owner}
            </p>
            <p className={styles.details}>
              <span className={styles.boldedDetail}>Publication Date:</span>{" "}
              {item.publication_date}
            </p>
            <p className={styles.details}>
              <span className={styles.boldedDetail}>Patent Number:</span>{" "}
              {item.publication_id}
            </p>
            <a
              className={styles.patentLink}
              href={item.www_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Patents Link
            </a>
            {item.inventors && (
              <ul className={styles.inventorList}>
                {item.inventors.map((inventor) => (
                  <li className={styles.inventorItem} key={inventor}>
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
              <></>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Patent;
