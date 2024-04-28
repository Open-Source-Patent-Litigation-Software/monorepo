"use client";

import React from "react";
import {
  SummaryDiv,
  Title,
  InlineContainer,
  BlueSwipe,
} from "./styles";
import WaitlistPopup from "./component/waitlist/waitlist";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <SummaryDiv>
        <InlineContainer>
          <Title>
            Welcome to <BlueSwipe>EasyIP</BlueSwipe>. The all in one solution to
            IP research.
          </Title>
        </InlineContainer>
      </SummaryDiv>
      <WaitlistPopup />
    </>
  );
};
