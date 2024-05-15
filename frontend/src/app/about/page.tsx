"use client";
import styled, { keyframes } from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";

const GenericContainer = styled.div`
  padding: 20%;
  text-align: center;
`;
const Div1 = styled(GenericContainer)`
  background-color: #e8dfca;
  height: 100vh;
`;
const Div2 = styled(GenericContainer)`
  background-color: #4f6f52;
  height: 10vh;
`;

function Index() {
  return (
    <>
      <Navbar />
      <div>
        <Div1>
          <h1>What is EasyIP?</h1>
          <p>
            EasyIP is a platform that makes researching intellectual property
            easy by providing tools and resources to help you understand the
            process of protecting your intellectual property.
          </p>
        </Div1>

        <Div2>
          <h1>The Problem</h1>
          <p>
            We are here to provide IP analysts a
            <b> cost-effective and intuitive </b>
            way to quickly identify <b> patent infringement </b> in the ideation
            phase and generate a strategy for protection.
          </p>
        </Div2>

        <GenericContainer>
          <h1>Our Solution</h1>
          <div>
            <div>
              <h3>Vectorized Patent Search</h3>
              <p>
                Streamlines patent search process, making it more accessible and
                user-friendly for inventors and businesses
              </p>
            </div>
            <div>
              <h3>AI Powered Analysis</h3>
              <p>
                Utilizes advanced AI algorithms to quickly analyze and compare
                inventions against existing patents to determine patentability
              </p>
            </div>
            <div>
              <h3>Intuitive Interface</h3>
              <p>
                Utilizes a simple mechanism bar where users can input their
                product or invention details for instant analysis.
              </p>
            </div>
          </div>
        </GenericContainer>

        <GenericContainer>
          <h1>Meet Our Team</h1>
          <p>
            <a href="https://www.linkedin.com/in/cole-morehouse-b685b5220/">
              Cole Morehouse - CEO
            </a>
          </p>
          <p>
            <a href="https://www.linkedin.com/in/dev-kunjadia/">
              Dev Kunjadia - CTO
            </a>
          </p>
        </GenericContainer>
      </div>
      <Footer />
    </>
  );
}

export default Index;
