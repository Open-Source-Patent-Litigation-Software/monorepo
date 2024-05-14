"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import { SnapScrollContainer, DivView } from "../styles";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const PricingDiv = styled.div`
  background: #f5efe6;
  display: flex;
  margin-top: -5%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 110vh; /* Full viewport height */
  scroll-snap-align: start; /* Align the top of the element with the snap container's scrollport */
  width: 100%; /* Ensure it takes up the full width */
`;
const PricingContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  padding: 20px;
  width: 80%;
  height: 40vh; /* Take a good portion of the viewport height */
`;

const PricingCard = styled.div`
  width: 30%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const PlanName = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const PlanDivider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
`;

const PlanDescription = styled.p`
  flex-grow: 1;
`;

function Index() {
  return (
    <SnapScrollContainer>
      <Navbar />
      <PricingDiv>
        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "40px",
          }}
        >
          Pricing
        </h1>
        <PricingContainer>
          <PricingCard>
            <PlanName>Individual</PlanName>
            <PlanDivider />
            <PlanDescription>Restricted queries</PlanDescription>
          </PricingCard>
          <PricingCard>
            <PlanName>Small Team</PlanName>
            <PlanDivider />
            <PlanDescription>
              Unlimited queries and case storage
            </PlanDescription>
          </PricingCard>
          <PricingCard>
            <PlanName>Enterprise</PlanName>
            <PlanDivider />
            <PlanDescription>Contact us for details</PlanDescription>
          </PricingCard>
        </PricingContainer>
      </PricingDiv>
      <Footer />
    </SnapScrollContainer>
  );
}

export default Index;
