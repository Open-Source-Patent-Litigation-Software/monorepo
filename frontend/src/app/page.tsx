"use client";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
import { Summary } from "../components/summary/summary";
import "./home.css";

export default function Home() {
  return (
    <>
      <div className="snap-scroll-container">
        <Navbar />
        <div
          className="div-view custom-padding custom-background"
          style={{ "--custom-padding-top": "10%", "--custom-background-color": "#F5EFE6" } as React.CSSProperties}
        >
          <Summary />
        </div>
      </div>
      <Footer />
    </>
  );
}
