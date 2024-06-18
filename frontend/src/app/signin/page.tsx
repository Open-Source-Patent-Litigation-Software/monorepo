"use client";
import React from "react";
import PropTypes from "prop-types";
import SignInForm from "./_components/form/SignInForm";
import { Navbar } from "../../components/navbar/navbar";
import { DivView } from "../styles";
import { Footer } from "../../components/footer/footer";
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
