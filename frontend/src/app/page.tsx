"use client";
import { Navbar } from "./components/navbar/navbar";
import { DivView, SnapScrollContainer } from "./styles";
import { Footer } from "./components/footer/footer";
import { Summary } from "./components/summary/summary";
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
