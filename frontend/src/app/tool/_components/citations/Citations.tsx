// Citations.tsx
import React from "react";

interface Paragraph {
  paragraph: string;
  highlight: string;
}

interface Section {
  [key: string]: Paragraph[];
}

interface MetricData {
  [sectionName: string]: Paragraph[];
}

interface Data {
  [functionName: string]: MetricData;
}

interface DataProp {
  data: Data | null;
}

interface MetricProp {
  metricData: MetricData;
}

const SectionComponent: React.FC<MetricProp> = ({ metricData }) => {
  return (
    <div>
      {Object.entries(metricData).map(([sectionName, paragraphs]) => (
        <div key={sectionName}>
          <h4>{sectionName}</h4>
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              <div>{paragraph.paragraph}</div>
              <div>{paragraph.highlight}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Citations: React.FC<DataProp> = ({ data }) => {
  // this is probably not the best way to do this
  if(data == null ) return(<></>);
  return (
    <div>
      {Object.entries(data).map(([functionName, metricData]) => (
        <div key={functionName}>
          <h2>{functionName}</h2>
          <SectionComponent metricData={metricData} />
        </div>
      ))}
    </div>
  );
};

export default Citations;