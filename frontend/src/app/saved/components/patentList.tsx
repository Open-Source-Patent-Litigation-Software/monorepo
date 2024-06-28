"use client";
import React from "react";
import Link from "next/link";
import styles from "../saved.module.css";

const PatentList = ({ patents }: { patents: any[] }) => {
  return (
    <div className={styles.patentList}>
      {patents.map((patent) => (
        <div key={patent.patentNum} className={styles.patentItem}>
          <h3 className={styles.patentTitle}>{patent.search}</h3>
          <p className={styles.patentDetail}>
            Patent Number: {patent.patentNum}
          </p>
          <p className={styles.patentDetail}>
            Date Saved: {new Date(patent.dateSaved).toLocaleDateString()}
          </p>
          <p className={styles.patentDetail}>
            Date Created: {new Date(patent.dateCreated).toLocaleDateString()}
          </p>
          <Link href={`/saved/${patent.patentNum}`}>View Patent</Link>
        </div>
      ))}
    </div>
  );
};

export default PatentList;
