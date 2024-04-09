"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/navbar/navbar";
import { DivView, SnapScrollContainer } from "./styles";
import { createGlobalStyle } from "styled-components";

export default function Home() {
  return (
    <>
      <SnapScrollContainer>
        <Navbar />
        <DivView>Summary</DivView>
        <DivView>Statistics</DivView>
        <DivView>Demo</DivView>
        <DivView>Footer</DivView>
      </SnapScrollContainer>
    </>
  );
}
