"use client";
import React from "react";
import Link from "next/link";
import styles from "../saved.module.css";
import { Patent } from "../types";

const IndividualPatent = ({
  patent,
  removePatent,
}: {
  patent: Patent;
  removePatent: (id: string) => void;
}) => {
  const removeHandler = async () => {
    try {
      const response = await fetch("/api/remove_patent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: patent.patentInfo.id }),
      });
      const data = await response.json();
      if (data) {
        removePatent(patent.patentInfo.id);
      }
    } catch (error) {
      console.error("Error removing patent:", error);
    }
  };

  return (
    <div className={styles.patentItem}>
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
        <Link href={patent.patentInfo.www_link}>View on Google Patents</Link>
      </div>
      {/* <div>
        <Link href={`/saved/${patent.patentInfo.id}`}>View Patent Data</Link>
      </div> */}
      <div>
        <button onClick={removeHandler} className={styles.removeButton}>
          Remove
        </button>
      </div>
    </div>
  );
};

const PatentList = ({
  patents,
  removePatent,
}: {
  patents: Patent[];
  removePatent: (id: string) => void;
}) => {
  console.log("PatentList rendering with patents:", patents);
  return (
    <div className={styles.patentList}>
      {patents.map((patent) => (
        <IndividualPatent
          key={patent.patentInfo.id}
          patent={patent}
          removePatent={removePatent}
        />
      ))}
    </div>
  );
};

export default PatentList;