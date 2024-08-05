"use client";
import { Navbar } from "../_components/navbar/navbar";
import { Footer } from "../_components/footer/footer";
import Image from "next/image";
import styles from "./landing.module.css";

function Home() {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.container}>
        <section className={`${styles.section} ${styles.firstSection}`}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.productName}>DulanyAI</span>
          </h1>
          <p className={styles.landingCaption}>
            The all-in-one solution to IP research.
          </p>
          <div className={styles.buttonWrapper}>
            <a href="https://calendly.com/admin-dulany/product-demo" className={styles.demoButton}>
              Book a Demo
            </a>
          </div>
        </section>

        <section className={`${styles.section} ${styles.blackGround}`}>
          <div className={styles.sideBySideContainer}>
            <div className={styles.textWrapper}>
              <h2 className={styles.subtitle}>Disclosure Rankings</h2>
              <p className={styles.text}>
                Search and rank patents based on their similarity to your invention with our custom NLP Models.
              </p>
            </div>
            <div className={styles.imageWrapper}>
              <Image
                src="/landing/disclosureGeneration.png"
                alt="DulanyAI Dashboard"
                width={1200}
                height={800}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                }}
              />
            </div>
          </div>
        </section>


        <section className={`${styles.section} ${styles.lightGreenBg}`}>
          <div className={styles.sideBySideContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src="/landing/featureSearch.png"
                alt="Patent Feature Based Search"
                width={1200}
                height={800}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                }}
              />
            </div>
            <div className={styles.textWrapper}>
              <h2 className={styles.subtitle}>Patent Feature Based Search</h2>
              <p className={styles.text}>
                Perform feature-based searches to find relevant patents quickly.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
