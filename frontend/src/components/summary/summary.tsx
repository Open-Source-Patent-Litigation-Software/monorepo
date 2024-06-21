"use client";

import React from "react";
import "./Summary.css";
import WaitlistPopup from "./component/waitlist/waitlist";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <div className="summary-div">
        <div className="inline-container">
          <p className="title">
            Welcome to <span className="green-text">DulanyAI</span>. The all in one solution to
            IP research.
          </p>
        </div>
      </div>
      <WaitlistPopup />
    </>
  );
};
