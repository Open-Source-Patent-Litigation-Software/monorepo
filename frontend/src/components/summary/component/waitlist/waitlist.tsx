import React, { useState, useRef } from "react";
import "./waitlist.css";

const WaitlistPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

  const togglePopup = () => {
    setIsAnimating(true);
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      togglePopup();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const email = event.currentTarget.email.value;
    const phoneNumber = event.currentTarget.phone.value;
    try {
      const response = await fetch(`${apiUrl}/ops/addToWaitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phoneNumber }),
      });
      const data = await response.json();

      if (response.ok) {
        formRef.current?.reset();
        alert("Thank you for joining the waitlist!");
      } else {
        alert(
          `Error: ${
            data.error ||
            "There was an error submitting your request. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`There was an error: ${error}`);
    } finally {
      setIsSubmitting(false);
      togglePopup();
    }
  };

  return (
    <>
      <button className="waitlist-button" onClick={togglePopup}>
        Interested? Join our waitlist!
      </button>
      {isOpen && (
        <div className={`overlay ${!isOpen && isAnimating ? "fade-out" : "fade-in"}`} onClick={handleClose}>
          <div className={`modal ${!isOpen && isAnimating ? "fade-out" : "fade-in"}`} ref={modalRef}>
            <h1>Join the Waitlist</h1>
            <form className="form" onSubmit={handleSubmit} ref={formRef}>
              <label className="label" htmlFor="email">Email:</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                placeholder="Format: email@provider.com"
                required
                disabled={isSubmitting}
              />
              <label className="label" htmlFor="phone">Phone Number</label>
              <input
                className="input"
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="Format: 123-123-1234"
                required
                disabled={isSubmitting}
              />
              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
            <button className="button" onClick={togglePopup} disabled={isSubmitting}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitlistPopup;
