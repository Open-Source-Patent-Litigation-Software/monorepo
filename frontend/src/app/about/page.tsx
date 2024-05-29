"use client";
import styled, { keyframes } from "styled-components";
import React, { useEffect } from "react";
import { Navbar } from "../_components/navbar/navbar";
import { Footer } from "../_components/footer/footer";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section = styled.section`
  width: 100%;
  padding: 10% 15%;
  text-align: center;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  color: ${({ textColor }) => textColor || "#000"};
  animation: ${fadeIn} 1s ease-in;
  min-height: ${({ fullHeight }) => (fullHeight ? "100vh" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 5rem;
  margin-bottom: 3rem;
  color: ${({ color }) => color || "#000"};
`;

const Text = styled.p`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  line-height: 1.75;
`;

const Highlight = styled.b`
  font-weight: bold;
  color: #f5efe6;
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
`;

const Feature = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 300px;
  padding: 2rem;
  background-color: #f5efe6;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const FeatureTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1a4d2e;
`;

const FeatureText = styled.p`
  font-size: 1.25rem;
  line-height: 1.5;
  color: #333;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const TeamMember = styled.p`
  font-size: 1.5rem;
  a {
    color: #1a4d2e;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #4f6f52;
    }
  }
`;

const useFadeIn = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.style.animation = `fadeIn 1s ease-in`;
          section.style.opacity = 1;
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
      <Container>
        <Section bgColor="#f5efe6" fullHeight>
          <Title color="#1a4d2e">What is EasyIP?</Title>
          <Text textColor="#333">
            EasyIP is a platform that makes researching intellectual property
            easy by providing tools and resources to help you understand the
            process of protecting your intellectual property.
          </Text>
        </Section>

        <Section bgColor="#1a4d2e" textColor="#f5efe6">
          <Title color="#f5efe6">The Problem</Title>
          <Text>
            We are here to provide IP analysts a
            <Highlight> cost-effective and intuitive </Highlight>
            way to quickly identify <Highlight>
              {" "}
              patent infringement{" "}
            </Highlight>{" "}
            in the ideation phase and generate a strategy for protection.
          </Text>
        </Section>

        <Section bgColor="#4f6f52" textColor="#f5efe6">
          <Title color="#FFFFFF">Our Solution</Title>
          <FeaturesContainer>
            <Feature>
              <FeatureTitle>Vectorized Patent Search</FeatureTitle>
              <FeatureText>
                Streamlines patent search process, making it more accessible and
                user-friendly for inventors and businesses.
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureTitle>AI Powered Analysis</FeatureTitle>
              <FeatureText>
                Utilizes advanced AI algorithms to quickly analyze and compare
                inventions against existing patents to determine patentability.
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureTitle>Intuitive Interface</FeatureTitle>
              <FeatureText>
                Utilizes a simple mechanism bar where users can input their
                product or invention details for instant analysis.
              </FeatureText>
            </Feature>
          </FeaturesContainer>
        </Section>

        <Section bgColor="#f5efe6">
          <Title color="#1a4d2e">Meet Our Team</Title>
          <TeamContainer>
            <TeamMember>
              <a href="https://www.linkedin.com/in/cole-morehouse-b685b5220/">
                Cole Morehouse - CEO
              </a>
            </TeamMember>
            <TeamMember>
              <a href="https://www.linkedin.com/in/dev-kunjadia/">
                Dev Kunjadia - CTO
              </a>
            </TeamMember>
          </TeamContainer>
        </Section>
      </Container>
      <Footer />
    </div>
  );
}

export default Index;
