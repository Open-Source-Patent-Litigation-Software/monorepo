"use client";
import React from "react";
import SignInForm from "./components/form/SignInForm";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
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
