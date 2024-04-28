"use client";
import React from "react";
import { StyledFooter } from "./styles"; // Make sure to import the StyledFooter

interface FooterProps {
  // Define any props here if needed
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <StyledFooter>
      <p>© 2024 easyip.io - All rights reserved.</p>
    </StyledFooter>
  );
};
