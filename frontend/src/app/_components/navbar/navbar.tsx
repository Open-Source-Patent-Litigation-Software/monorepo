"use client";
import React from "react";
import Link from "next/link";
import { StyledNav, StyledUl, StyledLi, LogoText, LoginLink } from "./styles";

interface NavigationProps {
  // Your props here
}

export const Navbar: React.FC<NavigationProps> = (props) => {
  const routes = {
    about: "/about",
    contact: "/contact",
    // tool: "/tool",
  };

  return (
    <StyledNav>
      <LogoText>
        <Link href="/">EasyIP</Link>
      </LogoText>
      <StyledUl>
        {Object.entries(routes).map(([name, path]) => (
          <StyledLi key={name}>
            <Link href={path} passHref>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          </StyledLi>
        ))}
      </StyledUl>
      <LoginLink>
        <Link href="/signin">Sign In</Link>
      </LoginLink>
    </StyledNav>
  );
};
