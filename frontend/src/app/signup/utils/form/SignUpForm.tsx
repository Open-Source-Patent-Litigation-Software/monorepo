"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./signup.css";

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
    fetch(`${apiUrl}/ops/signup`, {
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
      <div className="form-container">
        <h1 className="form-title">Sign Up</h1>
        <h3 className="form-description">Create a new account.</h3>
        <hr className="hr" />
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="firstName">First Name:</label>
            <input
              className="input"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="lastName">Last Name:</label>
            <input
              className="input"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="email">Email:</label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="phone">Phone Number:</label>
            <input
              className="input"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">Password:</label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="button" type="submit">Sign Up</button>
          <h1 className="have-account">
            Have an Account?
            <span className="sign-in-link">
              <Link href="/signin">Sign In</Link>
            </span>
          </h1>
        </form>
      </div>

      {isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign-Up Successful</h2>
            <p>Welcome! Your account has been created successfully.</p>
            <button className="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;