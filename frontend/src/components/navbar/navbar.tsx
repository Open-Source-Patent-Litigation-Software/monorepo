"use client";
import React from "react";
import Link from "next/link";
import "./navbar.css";

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
    <nav className="styled-nav">
      <p className="logo-text">
        <Link href="/">EasyIP</Link>
      </p>
      <ul className="styled-ul">
        {Object.entries(routes).map(([name, path]) => (
          <li className="styled-li" key={name}>
            <Link href={path} passHref>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
      <p className="login-link">
        <Link href="/signin">Sign In</Link>
      </p>
    </nav>
  );
};
