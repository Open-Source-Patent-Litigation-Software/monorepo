"use client";
import React, { useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { navigate } from "@/redirects/toolRedirect";
import "./SignInForm.css";

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
      <div className="form-container">
        <h1 className="form-title">Sign In</h1>
        <h3 className="form-description">
          Welcome back! Please sign in to your account.
        </h3>
        <hr className="hr" />
        <form className="styled-form" onSubmit={handleSubmit}>
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
          <button className="button" type="submit">Sign In</button>
          {/* 
          <div className="no-account">
            No Account?
            <span className="sign-up-link">
              <Link href="/signup">Sign Up</Link>
            </span>
          </div>
          */}
        </form>
      </div>

      {/* 
      {isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign-In Successful</h2>
            <p>Welcome back! You have successfully signed in.</p>
            <button className="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )} 
      */}
    </>
  );
};

export default SignInForm;
