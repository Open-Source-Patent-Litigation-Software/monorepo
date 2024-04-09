"use client";

import React from "react";
import Link from "next/link";
import { StyledNav, StyledUl, StyledLi } from "./styles";
interface NavigationProps {
  // Your props here
}

export const Navbar: React.FC<NavigationProps> = (props) => {
  const routes = {
    home: "/",
    about: "/about",
    pricing: "/pricing",
    contact: "/contact",
    tool: "/tool",
  };

  return (
    <StyledNav>
      <StyledUl>
        <StyledLi> EasyIP </StyledLi>
        {Object.entries(routes).map(([name, path]) => (
          <StyledLi key={name}>
            <Link href={path} passHref>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          </StyledLi>
        ))}
      </StyledUl>
    </StyledNav>
  );
};
