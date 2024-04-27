"use client";

import React from "react";
import { SummaryDiv, Title, Description, Form } from "./styles";
import WaitlistPopup from "./component/waitlist/waitlist";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <SummaryDiv>
        <Title>Welcome to EasyIP</Title>
        <Description>
          We are here to make researching intellectual property seamless.
        </Description>
      </SummaryDiv>
        <WaitlistPopup />
    </>
  );
};
