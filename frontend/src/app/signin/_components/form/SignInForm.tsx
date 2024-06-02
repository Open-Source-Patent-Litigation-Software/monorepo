"use client";
import React, { useState } from "react";
import useUserStore from "@/app/_stores/useUserStore";
import { navigate } from "@/app/_redirects/toolRedirect";
import {
  FormContainer,
  StyledForm,
  FormTitle,
  FormDescription,
  HR,
  FormGroup,
  Label,
  Input,
  Button,
  ModalOverlay,
  ModalContent,
  NoAccount,
  SignUpLink,
} from "./styles";

const SignInForm = () => {
  const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;
  const setAll = useUserStore((state) => state.setAll);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${apiUrl}/ops/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        setAll({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
        setFormData({
          email: "",
          password: "",
        });
        setIsSubmitted(true);
        navigate();
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
        <FormTitle>Sign In</FormTitle>
        <FormDescription>
          Welcome back! Please sign in to your account.
        </FormDescription>
        <HR />
        <StyledForm onSubmit={handleSubmit}>
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
          <Button type="submit">Sign In</Button>
          {/* <NoAccount>
            No Account?
            <SignUpLink>
              <Link href="/signup">Sign Up</Link>
            </SignUpLink>
          </NoAccount> */}
        </StyledForm>
      </FormContainer>

      {/* {isSubmitted && (
        <ModalOverlay>
          <ModalContent>
            <h2>Sign-In Successful</h2>
            <p>Welcome back! You have successfully signed in.</p>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )} */}
    </>
  );
};

export default SignInForm;
