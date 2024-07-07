"use client";
import React from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import ContactForm from "./contactForm";
import styles from "./contact.module.css";

function Index() {
  return (
    <div className={styles.snapScrollContainer}>
      <Navbar />
      <div className={styles.divView}>
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}

export default Index;