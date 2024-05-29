"use client";
import { Navbar } from "./_components/navbar/navbar";
import { DivView, SnapScrollContainer } from "./styles";
import { Footer } from "./_components/footer/footer";
import { Summary } from "./_components/summary/summary";
export default function Home() {
  return (
    <>
      <SnapScrollContainer>
        <Navbar />
        <DivView>
          <Summary />
        </DivView>
      </SnapScrollContainer>
      <Footer />
    </>
  );
}
