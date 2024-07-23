"use client";
import React from "react";
import styles from "./footer.module.css";

interface FooterProps {
  // Define any props here if needed
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer className={styles.styledFooter}>
      <p>© 2024 dulany.ai - All rights reserved.</p>
    </footer>
  );
};
