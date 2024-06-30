"use client";

import React from "react";
import styles from "./Summary.module.css";
import WaitlistPopup from "./component/waitlist/waitlist";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <div className={styles.summaryDiv}>
        <div className={styles.inlineContainer}>
          <p className={styles.title}>
            Welcome to <span className={styles.greenText}>DulanyAI</span>. The
            all-in-one solution to IP research.
          </p>
        </div>
      </div>
      <WaitlistPopup />
    </>
  );
};
