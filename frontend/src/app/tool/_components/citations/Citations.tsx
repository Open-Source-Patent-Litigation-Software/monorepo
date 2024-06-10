// Citations.tsx
import React from "react";
import styles from "./Citations.module.css";

interface Paragraph {
  paragraph: string;
  highlight: string;
}

interface MetricData {
  [sectionName: string]: Paragraph[];
}

interface Data {
  [functionName: string]: MetricData;
}

interface CitationsProps {
  data: Data | null;
  metric: string;
}

const Citations: React.FC<CitationsProps> = ({ data, metric }) => {
  if (data === null || !data[metric]) {
    return null;
  }

  const metricData = data[metric];

  const highlightText = (paragraph: string, highlight: string) => {
    const parts = paragraph.split(highlight);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index !== parts.length - 1 && (
              <span className={styles.highlight}>{highlight}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div>
      <h2>{metric}</h2>
      {Object.entries(metricData).map(([sectionName, paragraphs]) => (
        <div key={sectionName}>
          <h4>{sectionName}</h4>
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              <div>{highlightText(paragraph.paragraph, paragraph.highlight)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Citations;