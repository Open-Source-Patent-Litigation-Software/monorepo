"use client";
import React from "react";
import PropTypes from "prop-types";
import SignUpForm from "./utils/form/SignUpForm";
import { Navbar } from "../components/navbar/navbar";
import { DivView } from "../styles";
import { Footer } from "../components/footer/footer";

interface props {}

function SignUpPage(props: props) {
  return (
    <div>
      <Navbar />
      <DivView paddingTop="250px">
        <SignUpForm />
      </DivView>
      <Footer />
    </div>
  );
}

SignUpPage.propTypes = {};

export default SignUpPage;
