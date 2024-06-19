import React from 'react';
import './metrics.css';

interface NonEditableMetricProps {
  metrics: string[];
  unlockMetrics: () => void;
}

const NonEditableMetrics: React.FC<NonEditableMetricProps> = ({ metrics, unlockMetrics }) => {
  const half = Math.ceil(metrics.length / 2);
  return (
    <div className="container">
      <div className="row">
        {metrics.slice(0, half).map((metric, index) => (
          <div className="metric-box" key={index}>
            <div className="metric-text">{metric}</div>
          </div>
        ))}
      </div>
      <div className="row">
        {metrics.slice(half).map((metric, index) => (
          <div className="metric-box" key={index + half}>
            <div className="metric-text">{metric}</div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="add-button" onClick={unlockMetrics}>Edit Metrics</button>
      </div>
    </div>
    
  );
}

export default NonEditableMetrics;
