import React from "react";
import "./patent.css";
import Patent from "./patent";
import { PatentListProps } from "@/types/types";

// PatentList component definition
const PatentList: React.FC<PatentListProps> = ({ items, metrics, search }) => {
  return (
    <div className="container">
      {items.map((item) => (
        <Patent
          item={item}
          searchMetrics={metrics}
          search={search}
          key={item.id}
        />
      ))}
    </div>
  );
};

export default PatentList;
