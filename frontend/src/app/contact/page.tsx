"use client";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SnapScrollContainer, DivView } from "../styles";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";

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
  margin-top: -5%;
  display: flex;
  flex-direction: column;
  min-height: 70vh;
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

const FormGroupInline = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const InlineField = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 10px;
  }
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

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 100%;
  height: 150px; /* Make the message box larger */
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

const ContactForm = () => {
  const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${apiUrl}/ops/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        alert("There was an error submitting your form. Please try again.");
      });
  };

  const closeModal = () => {
    setIsSubmitted(false);
  };

  return (
    <>
      <FormContainer>
        <FormTitle>Contact The EasyIP Team</FormTitle>
        <FormDescription>We will contact you within 24 hours.</FormDescription>
        <HR />
        <StyledForm onSubmit={handleSubmit}>
          <FormGroupInline>
            <InlineField>
              <Label htmlFor="firstName">First Name:</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </InlineField>
            <InlineField>
              <Label htmlFor="lastName">Last Name:</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InlineField>
          </FormGroupInline>
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
            <Label htmlFor="message">Message:</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></Textarea>
          </FormGroup>
          <Button type="submit">Submit</Button>
        </StyledForm>
      </FormContainer>

      {isSubmitted && (
        <ModalOverlay>
          <ModalContent>
            <h2>Form Submitted</h2>
            <p>Thank you for contacting us! We will get back to you shortly.</p>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

function Index() {
  return (
    <SnapScrollContainer>
      <Navbar />
      <DivView>
        <ContactForm />
      </DivView>
      <Footer />
    </SnapScrollContainer>
  );
}

export default Index;
