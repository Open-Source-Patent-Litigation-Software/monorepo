"use client";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { SnapScrollContainer, DivView } from "../styles";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";

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

const Form = styled.form`
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
  color: #F5EFE6;
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

const FormGroupInline = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const InlineField = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
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

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

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
    // You can add further form processing here (e.g., sending data to a server)
  };

  return (
    <FormContainer>
      <FormTitle>Contact The EasyIP Team</FormTitle>
      <FormDescription>We will contact you within 24 hours.</FormDescription>
      <HR />
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </FormContainer>
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
