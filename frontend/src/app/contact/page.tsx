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
        <div>Contact</div>
      </DivView>
      <Footer />
    </SnapScrollContainer>
  );
}

export default index;
