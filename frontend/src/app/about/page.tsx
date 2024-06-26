"use client";
import React, { useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import "./about.css";

const useFadeIn = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.style.animation = `fadeIn 1s ease-in`;
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
      <div className="container">
        <section
          className="section full-height"
          style={{ backgroundColor: "#f5efe6", color: "#000" }}
        >
          <h1 className="title" style={{ color: "#1a4d2e" }}>
            What is DulanyAI?
          </h1>
          <p className="text" style={{ color: "#333" }}>
            DulanyAI is a platform that makes researching intellectual property
            easy by providing tools and resources to help you understand the
            process of protecting your intellectual property.
          </p>
        </section>

        <section
          className="section"
          style={{ backgroundColor: "#1a4d2e", color: "#f5efe6" }}
        >
          <h1 className="title" style={{ color: "#f5efe6" }}>
            The Problem
          </h1>
          <p className="text">
            We are here to provide IP analysts a
            <span className="highlight"> cost-effective and intuitive </span>
            way to quickly identify{" "}
            <span className="highlight"> patent infringement </span> in the
            ideation phase and generate a strategy for protection.
          </p>
        </section>

        <section
          className="section"
          style={{ backgroundColor: "#4f6f52", color: "#f5efe6" }}
        >
          <h1 className="title" style={{ color: "#FFFFFF" }}>
            Our Solution
          </h1>
          <div className="features-container">
            <div className="feature">
              <h3 className="feature-title">Vectorized Patent Search</h3>
              <p className="feature-text">
                Streamlines patent search process, making it more accessible and
                user-friendly for inventors and businesses.
              </p>
            </div>
            <div className="feature">
              <h3 className="feature-title">AI Powered Analysis</h3>
              <p className="feature-text">
                Utilizes advanced AI algorithms to quickly analyze and compare
                inventions against existing patents to determine patentability.
              </p>
            </div>
            <div className="feature">
              <h3 className="feature-title">Intuitive Interface</h3>
              <p className="feature-text">
                Utilizes a simple mechanism bar where users can input their
                product or invention details for instant analysis.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section"
          style={{ backgroundColor: "#f5efe6", color: "#000" }}
        >
          <h1 className="title" style={{ color: "#1a4d2e" }}>
            Meet Our Team
          </h1>
          <div className="team-container">
            <p className="team-member">
              <a href="https://www.linkedin.com/in/cole-morehouse-b685b5220/">
                Cole Morehouse - CEO / Product Manager
              </a>
            </p>
            <p className="team-member">
              <a href="https://www.linkedin.com/in/dev-kunjadia/">
                Dev Kunjadia - CTO / Founding Engineer
              </a>
            </p>
            <p className="team-member">
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
