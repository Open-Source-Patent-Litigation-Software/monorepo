"use client";
import React from "react";
import Link from "next/link";
import "./navbar.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { redirectToTool } from "@/redirects/toolRedirect";
import { useEffect } from "react";
interface NavigationProps {
  // Your props here
}

export const Navbar: React.FC<NavigationProps> = (props) => {
  const { user, error, isLoading } = useUser();

  const routesLoggedOut = {
    about: "/about",
    contact: "/contact",
    dashboard: "/dashboard",
  };

  const handleSignOut = () => {
    window.location.href = "/api/auth/logout";
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <nav className="styled-nav">
      <p className="logo-text">
        <Link href="/">DulanyAI</Link>
      </p>
      {
        <ul className="styled-ul">
          {Object.entries(routesLoggedOut).map(([name, path]) => (
            <li className="styled-li" key={name}>
              <Link href={path} passHref>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      }
      {user && (
        <p className="auth-link">
          <a onClick={handleSignOut} style={{ cursor: "pointer" }}>
            Sign Out
          </a>
        </p>
      )}
      {!user && (
        <p className="auth-link">
          <a onClick={handleSignIn} style={{ cursor: "pointer" }}>
            Sign In
          </a>
        </p>
      )}
    </nav>
  );
};
