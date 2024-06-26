"use client";
import React from "react";
import SignInForm from "./components/form/SignInForm";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import "./signin.css";

interface props {}

function Index(props: props) {
  return (
    <div>
      <Navbar />
      <div
        className="div-view"
        style={{ "--padding-top": "200px" } as React.CSSProperties}
      >
        <SignInForm />
      </div>
      <Footer />
    </div>
  );
}

export default Index;
