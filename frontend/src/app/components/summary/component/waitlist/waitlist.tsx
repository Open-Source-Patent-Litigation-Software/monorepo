// WaitlistPopup.jsx
import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Label,
  Overlay,
  Form,
  Modal,
  WaitlistButton,
} from "./styles";

const WaitlistPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

  const togglePopup = () => {
    setIsAnimating(true);
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300); // Corresponds to animation duration
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
      console.log(data);
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <WaitlistButton onClick={togglePopup}>
        Interested? Join our waitlist!
      </WaitlistButton>
      {isOpen && (
        <Overlay out={!isOpen && isAnimating} onClick={handleClose}>
          <Modal ref={modalRef} out={!isOpen && isAnimating}>
            <h1>Join the Waitlist</h1>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Format: email@provider.com"
                required
              />
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="Format: 123-123-1234"
                required
              />
              <Button type="submit">Submit</Button>
            </Form>
            <Button onClick={togglePopup}>Close</Button>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default WaitlistPopup;
