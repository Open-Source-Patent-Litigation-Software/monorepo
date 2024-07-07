"use client";
import React from "react";
import './footer.css';

interface FooterProps {
  // Define any props here if needed
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer className="styled-footer">
      <p>© 2024 dulany.ai - All rights reserved.</p>
    </footer>
  );
};
