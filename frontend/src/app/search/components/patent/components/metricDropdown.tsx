import React from "react";
import styles from './MetricDropdown.module.css';
import { MetricDropdownProps } from "@/types/types";

const MetricDropdown: React.FC<MetricDropdownProps> = ({
  searchMetrics,
  selectedMetric,
  handleDropdownChange,
}) => {
  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.dropdownLabel}>Select a Metric to Analyze</label>
      <select
        className={styles.dropdownSelect}
        onChange={handleDropdownChange}
        value={selectedMetric || ""}
      >
        <option className={styles.dropdownOption} value="" disabled>
          Select a Metric
        </option>
        {searchMetrics.map((metric) => (
          <option className={styles.dropdownOption} key={metric} value={metric}>
            {metric}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MetricDropdown;
