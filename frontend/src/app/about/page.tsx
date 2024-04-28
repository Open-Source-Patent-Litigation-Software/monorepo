"use client";

import React from "react";
import { SnapScrollContainer, DivView } from "../styles";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
function index() {
  return (
    <SnapScrollContainer>
      <Navbar />
      <DivView>
        <h1>What is EasyIP?</h1>
        <p>
          EasyIP is a platform that makes researching intellectual property easy.
          by providing tools and resources to help you understand the process of
          protecting your intellectual property.
        </p>
      </DivView>
      <Footer />
    </SnapScrollContainer>
  );
}

export default index;
