"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FormContainer,
  StyledForm,
  FormTitle,
  FormDescription,
  HR,
  Label,
  Input,
  Button,
  FormGroup,
  ModalOverlay,
  ModalContent,
  HaveAccount,
  SignInLink,
} from "./styles";

const SignUpForm = () => {
  const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    fetch(`${apiUrl}/ops/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting your form. Please try again.");
      });
  };

  const closeModal = () => {
    setIsSubmitted(false);
  };

  return (
    <>
      <FormContainer>
        <FormTitle>Sign Up</FormTitle>
        <FormDescription>Create a new account.</FormDescription>
        <HR />
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="firstName">First Name:</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">Last Name:</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number:</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit">Sign Up</Button>
          <HaveAccount>
            Have an Account?
            <SignInLink>
              <Link href="/signin">Sign In</Link>
            </SignInLink>
          </HaveAccount>
        </StyledForm>
      </FormContainer>

      {isSubmitted && (
        <ModalOverlay>
          <ModalContent>
            <h2>Sign-Up Successful</h2>
            <p>Welcome! Your account has been created successfully.</p>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default SignUpForm;
