"use client";
import React from "react";
import PropTypes from "prop-types";
import SignUpForm from "./utils/form/SignUpForm";
import { Navbar } from "../_components/navbar/navbar";
import { DivView } from "../styles";
import { Footer } from "../_components/footer/footer";

interface props {}

function SignUpPage(props: props) {
  return (
    <div>
      <Navbar />
      <DivView paddingTop="300px">
        <SignUpForm />
      </DivView>
      <Footer />
    </div>
  );
}

SignUpPage.propTypes = {};

export default SignUpPage;
