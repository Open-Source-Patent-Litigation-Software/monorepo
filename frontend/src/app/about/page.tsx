"use client";
import React, { useEffect, useState } from "react";
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

interface TeamMember {
  name: string;
  role: string;
  blurb: string;
  linkedin: string;
}

const FlippingCard: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Cole Morehouse",
      role: "CEO / Product Manager",
      blurb: "Cole brings a wealth of experience in product management and a vision for revolutionizing IP research. He is currently a senior at the University of Michigan and is planning to pursue a graduate degree in law.",
      linkedin: "https://www.linkedin.com/in/cole-morehouse-b685b5220/"
    },
    {
      name: "Dev Kunjadia",
      role: "CTO / Founding Engineer",
      blurb: "Dev is an engineer with a passion for creating innovative AI solutions for complex problems. He is currently a senior at the University of Michigan studying Computer Science and plans to pursue a career in AI infrastructure.",
      linkedin: "https://www.linkedin.com/in/dev-kunjadia/"
    },
    {
      name: "Alec Palo",
      role: "CFO / Founding Engineer",
      blurb: "Alec combines financial acumen with engineering expertise to drive DulanyAI's growth and sustainability. He is a graduate of the University of Michigan - Ross School of Business and is currently working at Radient Nuclear. ",
      linkedin: "https://www.linkedin.com/in/apalo/"
    }
  ];

  const [currentMember, setCurrentMember] = useState<number>(0);
  const [isAutoChanging, setIsAutoChanging] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoChanging) {
      interval = setInterval(() => {
        setCurrentMember((prev) => (prev + 1) % teamMembers.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoChanging, teamMembers.length]);

  const handleClick = (): void => {
    setCurrentMember((prev) => (prev + 1) % teamMembers.length);
    setIsAutoChanging(false);
    // Resume auto-changing after 15 seconds of inactivity
    setTimeout(() => setIsAutoChanging(true), 15000);
  };

  const member = teamMembers[currentMember];

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={styles.card}>
        <div className={`${styles.cardContent} ${isAutoChanging ? styles.fadeInOut : ''}`}>
          <h2>{member.name}</h2>
          <p>{member.role}</p>
          <p>{member.blurb}</p>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  );
};

function Index() {
  useFadeIn();

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <section
          className={`${styles.section} ${styles.fullHeight} ${styles.lightBg}`}
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
                Build with advanced AI algorithms to quickly analyze and compare
                inventions to determine patentability.
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

        <section className={`${styles.section} ${styles.darkGreenBg}`}>
          <h1 className={`${styles.title} ${styles.whiteText}`}>
            Meet Our Team
          </h1>
          <FlippingCard />
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
