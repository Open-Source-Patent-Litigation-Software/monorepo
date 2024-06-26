"use client";
import React from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import ContactForm from "./contactForm";
import "./contact.css";

function Index() {
  return (
    <div className="snap-scroll-container">
      <Navbar />
      <div className="div-view">
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}

export default Index;
