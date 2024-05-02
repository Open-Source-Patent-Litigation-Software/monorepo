"use client";
import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";

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

const StyledLink = styled.a`
  color: #334acc; /* Blue shade for the link */
  text-decoration: none; /* Removes underline */
  font-weight: bold; /* Makes text bold */

  &:hover {
    color: #657bcc; /* Lighter blue shade on hover */
    text-decoration: underline; /* Adds underline on hover */
  }
`;

const StyledHr = styled.hr`
  border: none;
  border-top: 2px solid #333;
  width: 90%;
  margin: 10% auto;
`;

const ViewContainer = styled.div`
  background: linear-gradient(
    180deg,
    rgba(34, 0, 255, 0.05) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(34, 0, 255, 0.05) 100%
  );
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledP = styled.p`
  font-size: 2rem;
  line-height: 1.6;
  width: 70%;
  color: #666;
  text-align: center;
  animation: ${fadeIn} 1s ease-out 0.2s;
`;

const AdvantagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out 0.4s;
  width: 100%;
`;

const AdvantageCard = styled.div`
  width: 300px;
  height: 300px;
  margin: 2%;
  perspective: 1000px;
  cursor: pointer;

  &:hover .card-inner {
    transform: rotateY(180deg);
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #f5f5f5;
  border-radius: 25px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 2rem;
    padding: 20px;
  }
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #f5f5f5;
  border-radius: 25px;
  box-shadow: 0px 0px 30px rgba(0, 0, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateY(180deg);

  p {
    font-size: 1.5rem;
    line-height: 1.4;
    padding: 20px;
  }
`;
function AdvantageFlipCard({ title, description }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <AdvantageCard onClick={handleFlip}>
      <CardInner
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <CardFront>
          <h3>{title}</h3>
        </CardFront>
        <CardBack>
          <p>{description}</p>
        </CardBack>
      </CardInner>
    </AdvantageCard>
  );
}
interface StyledH1Props {
  isVisible: boolean;
}

const StyledH1 = styled.h1<StyledH1Props>`
  font-size: 5rem;
  color: #333;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0;
  transform: translateX(-100px); // Start from -100px on the X-axis
  animation-fill-mode: forwards;
  animation-duration: 1s;
  animation-name: ${(props) => (props.isVisible ? "fadeInLeft" : "none")};

  @keyframes fadeInLeft {
    0% {
      opacity: 0;
      transform: translateX(-100px); // Start the animation from -100px
    }
    100% {
      opacity: 1;
      transform: translateX(0); // End at the normal position
    }
  }
`;

function useOnScreen(ref: React.RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

function H1Component({ children }: React.PropsWithChildren<{}>) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <StyledH1 ref={ref} isVisible={isVisible}>
      {children}
    </StyledH1>
  );
}

function Index() {
  return (
    <>
      <Navbar />
      <ViewContainer>
        <SectionContainer>
          <H1Component>What is EasyIP?</H1Component>
          <StyledP>
            EasyIP is a platform that makes researching intellectual property
            easy by providing tools and resources to help you understand the
            process of protecting your intellectual property.
          </StyledP>
        </SectionContainer>

        <StyledHr />

        <SectionContainer>
          <H1Component>The Problem</H1Component>
          <StyledP>
            We are here to provide IP analysts a
            <b> cost-effective and intuitive </b>
            way to identify quickly identify <b> patent infringement </b> in the
            ideation phase and generate a strategy for protection.
          </StyledP>
        </SectionContainer>

        <StyledHr />

        <SectionContainer>
          <H1Component>Our Solution</H1Component>
          <AdvantagesContainer>
            <AdvantageFlipCard
              title="Vectorized Patent Search"
              description="Streamlines patent search process, making it more accessible and user-friendly for inventors and businesses"
            />
            <AdvantageFlipCard
              title="AI Powered Analysis"
              description="Utilizes advanced AI algorithms to quickly analyze and compare inventions against existing patents to determine patentability"
            />
            <AdvantageFlipCard
              title="Intuitive Interface"
              description="Utilizes a simple mechanism bar where users can input their product or invention details for instant analysis."
            />
          </AdvantagesContainer>
        </SectionContainer>

        <StyledHr />

        <SectionContainer>
          <H1Component>Meet Our Team</H1Component>
          <StyledP>
            <StyledLink href="https://www.linkedin.com/in/cole-morehouse-b685b5220/">
              Cole Morehouse - CEO
            </StyledLink>
          </StyledP>
          <StyledP>
            <StyledLink href="https://www.linkedin.com/in/dev-kunjadia/">
              Dev Kunjadia - CTO
            </StyledLink>
          </StyledP>
        </SectionContainer>
      </ViewContainer>
      <Footer />
    </>
  );
}

export default Index;
