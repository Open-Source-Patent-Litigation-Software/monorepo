"use client";
import React from "react";
import PropTypes from "prop-types";
import SignInForm from "./_utils/form/SignInForm";
import { Navbar } from "../_components/navbar/navbar";
import { DivView } from "../styles";
import { Footer } from "../_components/footer/footer";
interface props {}

function Index(props: props) {
  return (
    <div>
      <Navbar />
      <DivView paddingTop="200px">
        <SignInForm />
      </DivView>
      <Footer />
    </div>
  );
}

Index.propTypes = {};

export default Index;
