"use client";
import React from "react";
import SignUpForm from "./utils/form/SignUpForm";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import "./signup.css";

interface Props {}

function SignUpPage(props: Props) {
  return (
    <div>
      <Navbar />
      <div
        className="div-view"
        style={{ "--padding-top": "300px" } as React.CSSProperties}
      >
        <SignUpForm />
      </div>
      <Footer />
    </div>
  );
}

export default SignUpPage;
