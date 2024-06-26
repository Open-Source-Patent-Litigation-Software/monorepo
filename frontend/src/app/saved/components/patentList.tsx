"use client";
import React from "react";
import "../saved.css";
import Link from "next/link";
const PatentList = ({ patents }: { patents: any[] }) => {
  return (
    <div className="patent-list">
      {patents.map((patent) => (
        <div key={patent.patentNum} className="patent-item">
          <h3 className="patent-title">{patent.search}</h3>
          <p className="patent-detail">Patent Number: {patent.patentNum}</p>
          <p className="patent-detail">
            Date Saved: {new Date(patent.dateSaved).toLocaleDateString()}
          </p>
          <p className="patent-detail">
            Date Created: {new Date(patent.dateCreated).toLocaleDateString()}
          </p>
          <Link href={`/saved/${patent.patentNum}`}>View Patent</Link>
        </div>
      ))}
    </div>
  );
};

export default PatentList;
