import React from "react";
import styles from "./Citations.module.css";
import { Dictionary } from "@/utils/dictionary";
import LoadingSpinner from "../loading/loadingSpinner";
interface Paragraph {
  before: string;
  highlight: string;
  after: string;
}

interface MetricData {
  [sectionName: string]: Paragraph[];
}

interface Data {
  [sectionName: string]: Paragraph[];
}

interface CitationsProps {
  data: Dictionary;
  metric: string;
  loading: boolean;
}

const Citations: React.FC<CitationsProps> = ({ data, metric, loading }) => {
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return <div className={styles.loading}>Loading citations...</div>;
  }

  if (!data || !data[metric]) {
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
      <h2 className={styles.metricTitle}>{capitalizeFirstLetter(metric)}</h2>
      {Object.entries(metricData)
        .filter(
          ([_, paragraphs]) =>
            Array.isArray(paragraphs) && paragraphs.length > 0
        )
        .map(([sectionName, paragraphs]) => (
          <div key={sectionName} className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {capitalizeFirstLetter(sectionName)}
            </h4>
            {Array.isArray(paragraphs) &&
              paragraphs.map((paragraph: Paragraph, index: any) => (
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
