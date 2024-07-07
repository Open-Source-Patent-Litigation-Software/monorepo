import React from "react";
import '../patent.css';
import { MetricDropdownProps } from "@/types/types";

const MetricDropdown: React.FC<MetricDropdownProps> = ({
    searchMetrics,
    selectedMetric,
    handleDropdownChange,
}) => {
    return (
        <div className="dropdown-container">
            <label className="dropdown-label">Select a Metric to Analyze</label>
            <select
                className="dropdown-select"
                onChange={handleDropdownChange}
                value={selectedMetric || ""}
            >
                <option className="dropdown-option" value="" disabled>
                    Select a Metric
                </option>
                {searchMetrics.map((metric) => (
                    <option className="dropdown-option" key={metric} value={metric}>
                        {metric}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MetricDropdown;
