"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/navbar/navbar";
import { StyledMain } from "./styles";
import { createGlobalStyle } from 'styled-components';


export default function Home() {
  return (
    <>
      <StyledMain>
        <Navbar />
        <div>Summary</div>
        <div>Statistics</div>
        <div>Demo</div>
        <div>Footer</div>
      </StyledMain>
    </>
  );
}
