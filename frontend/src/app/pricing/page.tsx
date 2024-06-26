"use client";
import React from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import "./pricing.css";

function Index() {
  return (
    <div className="snap-scroll-container">
      <Navbar />
      <div className="pricing-div">
        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "40px",
          }}
        >
          Pricing
        </h1>
        <div className="pricing-container">
          <div className="pricing-card">
            <h2 className="plan-name">Individual</h2>
            <hr className="plan-divider" />
            <p className="plan-description">Restricted queries</p>
          </div>
          <div className="pricing-card">
            <h2 className="plan-name">Small Team</h2>
            <hr className="plan-divider" />
            <p className="plan-description">
              Unlimited queries and case storage
            </p>
          </div>
          <div className="pricing-card">
            <h2 className="plan-name">Enterprise</h2>
            <hr className="plan-divider" />
            <p className="plan-description">Contact us for details</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
