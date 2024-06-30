"use client";
import React, { useState } from "react";
import styles from "./contact.module.css";

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
      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Contact The DulanyAI Team</h1>
        <h3 className={styles.formDescription}>
          We will contact you within 24 hours.
        </h3>
        <hr className={styles.hr} />
        <form className={styles.styledForm} onSubmit={handleSubmit}>
          <div className={styles.formGroupInline}>
            <div className={styles.inlineField}>
              <label className={styles.label} htmlFor="firstName">
                First Name:
              </label>
              <input
                className={styles.input}
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inlineField}>
              <label className={styles.label} htmlFor="lastName">
                Last Name:
              </label>
              <input
                className={styles.input}
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email:
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">
              Message:
            </label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
      </div>

      {isSubmitted && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Form Submitted</h2>
            <p>Thank you for contacting us! We will get back to you shortly.</p>
            <button className={styles.button} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;
