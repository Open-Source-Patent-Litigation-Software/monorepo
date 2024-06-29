"use client";
import React from "react";
import Link from "next/link";
import styles from "../saved.module.css";
import { Patent } from "../types"; // Adjust the import path accordingly

const PatentList = ({ patents }: { patents: Patent[] }) => {
  return (
    <div className={styles.patentList}>
      {patents.map((patent) => (
        <div key={patent.patentInfo.id} className={styles.patentItem}>
          <h3 className={styles.patentTitle}>{patent.patentInfo.title}</h3>
          <p className={styles.patentDetail}>
            Your Search: &quot;{patent.search}&quot;
          </p>
          <p className={styles.patentDetail}>
            Patent Number: {patent.patentInfo.publication_id}
          </p>
          <p className={styles.patentDetail}>
            Date Saved: {new Date(patent.dateSaved).toLocaleDateString()}
          </p>
          <p className={styles.patentDetail}>
            Date Created:{" "}
            {new Date(patent.patentInfo.publication_date).toLocaleDateString()}
          </p>
          <div>
            <Link href={patent.patentInfo.www_link}>
              View on Google Patents
            </Link>
          </div>
          <div>
            <Link href={`/saved/${patent.patentInfo.id}`}>
              View Patent Data
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatentList;
