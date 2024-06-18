import React from 'react';
import './metrics.css';
import { MetricProps } from '@/types/types';

const Metrics: React.FC<MetricProps> = ({ metrics, addMetric, removeMetric, editMetric }) => {
  const half = Math.ceil(metrics.length / 2);
  return (
    <div className="container">
      <div className="row">
        {metrics.slice(0, half).map((metric, index) => (
          <div className="metric" key={index}>
            <textarea
              className="textarea"
              value={metric}
              onChange={(e) => editMetric(index, e.target.value)}
            />
            <button className="remove-button" onClick={() => removeMetric(index)}>✕</button>
          </div>
        ))}
      </div>
      <div className="row">
        {metrics.slice(half).map((metric, index) => (
          <div className="metric" key={index + half}>
            <textarea
              className="textarea"
              value={metric}
              onChange={(e) => editMetric(index + half, e.target.value)}
            />
            <button className="remove-button" onClick={() => removeMetric(index + half)}>✕</button>
          </div>
        ))}
      </div>
      <button className="add-button" onClick={addMetric}>Add Metric</button>
    </div>
  );
}

export default Metrics;
