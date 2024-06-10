import React from "react";
import styles from "./Citations.module.css";
import { Dictionary } from "@/app/_utils/dictionary";

interface Paragraph {
  before: string;
  highlight: string;
  after: string;
}

interface MetricData {
  [sectionName: string]: Paragraph[];
}

interface Data {
  [metric: string]: MetricData;
}

interface CitationsProps {
  data: Dictionary;
  metric: string;
  loading: boolean;
}

const Citations: React.FC<CitationsProps> = ({ data, metric, loading }) => {
  if (loading) {
    return <div className={styles.loading}>Loading citations...</div>;
  }

  if (data === null || !data[metric]) {
    return <div className={styles.noCitations}>No citations available.</div>;
  }

  const metricData = data[metric];

  const highlightText = (before: string, highlight: string, after: string) => {
    return (
      <div className={styles.paragraph}>
        <span>{before}</span>
        <span className={styles.highlight}>{highlight}</span>
        <span>{after}</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.metricTitle}>{metric}</h2>
      {Object.entries(metricData).map(([sectionName, paragraphs]) => (
        <div key={sectionName} className={styles.section}>
          <h4 className={styles.sectionTitle}>{sectionName}</h4>
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              {highlightText(
                paragraph.before,
                paragraph.highlight,
                paragraph.after
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Citations;