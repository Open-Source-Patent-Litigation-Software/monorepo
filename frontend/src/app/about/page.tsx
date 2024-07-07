"use client";
import React, { useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import styles from "./about.module.css";

const useFadeIn = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.style.animation = `${styles.fadeIn} 1s ease-in`;
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};

function Index() {
  useFadeIn();

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <section
          className={`${styles.section} ${styles.fullHeight} ${styles.coloredDiv}`}
        >
          <h1 className={`${styles.title} ${styles.greenText}`}>
            What is DulanyAI?
          </h1>
          <p className={`${styles.text} ${styles.darkText}`}>
            DulanyAI is a platform that makes researching intellectual property
            easy by providing tools and resources to help you understand the
            process of protecting your intellectual property.
          </p>
        </section>

        <section className={`${styles.section} ${styles.darkGreenBg}`}>
          <h1 className={`${styles.title} ${styles.lightText}`}>The Problem</h1>
          <p className={`${styles.text} ${styles.lightText}`}>
            We are here to provide IP analysts a
            <span className={styles.highlight}>
              {" "}
              cost-effective and intuitive{" "}
            </span>
            way to quickly identify{" "}
            <span className={styles.highlight}> patent infringement </span> in
            the ideation phase and generate a strategy for protection.
          </p>
        </section>

        <section className={`${styles.section} ${styles.lightGreenBg}`}>
          <h1 className={`${styles.title} ${styles.whiteText}`}>
            Our Solution
          </h1>
          <div className={styles.featuresContainer}>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Vectorized Patent Search</h3>
              <p className={styles.featureText}>
                Streamlines patent search process, making it more accessible and
                user-friendly for inventors and businesses.
              </p>
            </div>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>AI Powered Analysis</h3>
              <p className={styles.featureText}>
                Utilizes advanced AI algorithms to quickly analyze and compare
                inventions against existing patents to determine patentability.
              </p>
            </div>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Intuitive Interface</h3>
              <p className={styles.featureText}>
                Utilizes a simple mechanism bar where users can input their
                product or invention details for instant analysis.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.coloredDiv}`}>
          <h1 className={`${styles.title} ${styles.greenText}`}>
            Meet Our Team
          </h1>
          <div className={styles.teamContainer}>
            <p className={styles.teamMember}>
              <a href="https://www.linkedin.com/in/cole-morehouse-b685b5220/">
                Cole Morehouse - CEO / Product Manager
              </a>
            </p>
            <p className={styles.teamMember}>
              <a href="https://www.linkedin.com/in/dev-kunjadia/">
                Dev Kunjadia - CTO / Founding Engineer
              </a>
            </p>
            <p className={styles.teamMember}>
              <a href="https://www.linkedin.com/in/apalo/">
                Alec Palo - CFO / Founding Engineer
              </a>
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
