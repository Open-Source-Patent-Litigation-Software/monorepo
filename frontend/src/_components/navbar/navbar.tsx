"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";

interface NavigationProps {
  // Your props here
}

export const Navbar: React.FC<NavigationProps> = (props) => {
  const { user, error, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const routesLoggedOut = {
    about: "/about",
  };
  const routesLoggedIn = {
    about: "/about",
    dashboard: "/dashboard",
  };

  const handleSignOut = () => {
    window.location.href = "/api/auth/logout";
  };

  const handleSignIn = () => {
    window.location.href = "/api/auth/login";
  };

  const toggleMenu = () => {
    if (isOpen) {
      // If closing, start animation then set state
      setIsOpen(false);
    } else {
      // If opening, set state immediately
      setIsOpen(true);
    }
  };

  return (
    <nav className={styles.styledNav}>
      <p className={styles.logoText}>
        <Link href="/">DulanyAI</Link>
      </p>
      {isMobile && (
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
      )}
      <div className={`${styles.navContent} ${isMobile ? (isOpen ? styles.open : '') : ''}`}>
        {!user && (
          <ul className={styles.styledUl}>
            {Object.entries(routesLoggedOut).map(([name, path]) => (
              <li className={styles.styledLi} key={name}>
                <Link href={path} passHref>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {user && (
          <ul className={styles.styledUl}>
            {Object.entries(routesLoggedIn).map(([name, path]) => (
              <li className={styles.styledLi} key={name}>
                <Link href={path} passHref>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {user && (
          <p className={styles.authLink}>
            <a onClick={handleSignOut} style={{ cursor: "pointer" }}>
              Sign Out
            </a>
          </p>
        )}
        {!user && (
          <p className={styles.authLink}>
            <a onClick={handleSignIn} style={{ cursor: "pointer" }}>
              Sign In
            </a>
          </p>
        )}
      </div>
    </nav>
  );
};