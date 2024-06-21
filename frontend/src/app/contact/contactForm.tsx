"use client";
import React, { useState } from "react";
import "./contact.css";

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
      <div className="form-container">
        <h1 className="form-title">Contact The DulanyAI Team</h1>
        <h3 className="form-description">We will contact you within 24 hours.</h3>
        <hr className="hr" />
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group-inline">
            <div className="inline-field">
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
            <div className="inline-field">
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
            <label className="label" htmlFor="message">Message:</label>
            <textarea
              className="textarea"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button className="button" type="submit">Submit</button>
        </form>
      </div>

      {isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Form Submitted</h2>
            <p>Thank you for contacting us! We will get back to you shortly.</p>
            <button className="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;
