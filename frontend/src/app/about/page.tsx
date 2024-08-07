"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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
  image: string;
  role: string;
  blurb: string;
  linkedin: string;
}

const TeamCard: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Cole Morehouse",
      image: "/headshots/cole_headshot.jpeg",
      role: "CEO / Product Manager",
      blurb:
        "Cole brings a wealth of experience in product management and a vision for revolutionizing IP research. He is currently a senior at the University of Michigan and is planning to pursue a graduate degree in law.",
      linkedin: "https://www.linkedin.com/in/cole-morehouse-b685b5220/",
    },
    {
      name: "Dev Kunjadia",
      image: "/headshots/dev_headshot.jpeg",
      role: "CTO / Founding Engineer",
      blurb:
        "Dev is an engineer with a passion for creating innovative AI solutions for complex problems. He is currently a senior at the University of Michigan studying Computer Science and plans to pursue a career in AI infrastructure.",
      linkedin: "https://www.linkedin.com/in/dev-kunjadia/",
    },
    {
      name: "Alec Palo",
      image: "/headshots/alec_headshot.jpeg",
      role: "CFO / Founding Engineer",
      blurb:
        "Alec combines financial acumen with engineering expertise to drive DulanyAI's growth and sustainability. He is a graduate of the University of Michigan - Ross School of Business and is currently working at Radient Nuclear.",
      linkedin: "https://www.linkedin.com/in/apalo/",
    },
  ];

  const [currentMember, setCurrentMember] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const switchMember = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMember((prev) => (prev + 1) % teamMembers.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }
  }, [isTransitioning, teamMembers.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      switchMember();
    }, 5000);

    return () => clearInterval(interval);
  }, [switchMember]);

  const handleClick = () => {
    switchMember();
  };

  const member = teamMembers[currentMember];

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={styles.card}>
        <div
          className={`${styles.cardContent} ${
            isTransitioning ? styles.fadeOut : styles.fadeIn
          }`}
        >
          <Image
            src={member.image}
            alt={member.name}
            width={150}
            height={150}
            className={styles.headshot}
          />
          <div className={styles.textContent}>
            <h2 className={styles.memberName}>{member.name}</h2>
            <p className={styles.memberRole}>{member.role}</p>
            <p className={styles.memberBlurb}>{member.blurb}</p>
          </div>
          <a
            className={`${styles.socialContainer} ${styles.containerThree}`}
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 448 512"
              className={`${styles.socialSvg} ${styles.linkdinSvg}`}
            >
              <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
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
            DulanyAI is a platform designed to simplify the research process for
            intellectual property by offering tools and resources that guide you
            through the steps of protecting your innovations.
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
              <h3 className={styles.featureTitle}>Advanced Patent Search</h3>
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
          <TeamCard />
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
