"use client";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FormContainer = styled.div`
  width: 60%;
  padding: 20px;
  border-radius: 10px;
  background-color: #4f6f52;
  margin-top: -10%;
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-in;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const FormTitle = styled.h1`
  text-align: center;
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 3rem;
`;

const FormDescription = styled.h3`
  text-align: center;
  color: #f5efe6;
  margin-bottom: 10px;
`;

const HR = styled.hr`
  margin-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #e8dfca;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #f5efe6;
  background-color: #1a4d2e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #153c24;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;

  h2 {
    margin-bottom: 20px; /* Add margin to increase space below the heading */
  }

  p {
    margin-bottom: 30px; /* Add margin to increase space below the paragraph */
  }

  button {
    width: 100%;
  }
`;

const HaveAccount = styled.h1`
  text-align: center;
  color: #f5efe6;
  margin-top: 50px;
  font-size: 2rem;
`;

const SignInLink = styled.span`
  a {
    color: inherit;
    text-decoration: underline;
    font-size: 2rem;
    padding-left: 20px;
    transition: color 0.3s ease, font-size 0.3s ease;
    &:hover {
      color: #ffffff;
      font-size: 2.1rem;
    }
  }
`;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
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
