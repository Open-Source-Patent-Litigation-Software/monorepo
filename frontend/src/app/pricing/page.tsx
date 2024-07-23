"use client";
import React from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import styles from "./pricing.module.css";

function Index() {
  return (
    <div className={styles.snapScrollContainer}>
      <Navbar />
      <div className={styles.pricingDiv}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "40px",
          }}
        >
          Pricing
        </h1>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingCard}>
            <h2 className={styles.planName}>Individual</h2>
            <hr className={styles.planDivider} />
            <p className={styles.planDescription}>Restricted queries</p>
          </div>
          <div className={styles.pricingCard}>
            <h2 className={styles.planName}>Small Team</h2>
            <hr className={styles.planDivider} />
            <p className={styles.planDescription}>
              Unlimited queries and case storage
            </p>
          </div>
          <div className={styles.pricingCard}>
            <h2 className={styles.planName}>Enterprise</h2>
            <hr className={styles.planDivider} />
            <p className={styles.planDescription}>Contact us for details</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
