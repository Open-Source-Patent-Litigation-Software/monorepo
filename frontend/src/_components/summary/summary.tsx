"use client";

import React from "react";
import styles from "./summary.module.css";
import WaitlistPopup from "./component/waitlist/waitlist";
import Typewriter from "typewriter-effect";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <div className={styles.summaryDiv}>
        <div className={styles.inlineContainer}>
          <p className={styles.title}>
            Welcome to <span className={styles.productName}>DulanyAI</span>. The
            all-in-one solution to IP research.
          </p>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.trustedBySection}>
        <span className={styles.trustedByText}>Trusted By:</span>
        <Typewriter
          options={{
            strings: ['White Stone Law', 'AIPI Solutions', 'Latin Locater LLC', 'Accumont Ventures'],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </>
  );
};