import React, { useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
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
  const modalRef = useRef(null);

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

  const handleClose = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      togglePopup();
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
            <h1>
              Join the Waitlist
              <button
                onClick={togglePopup}
                style={{ fontSize: "24px", border: "none", background: "none" }}
              >
                &#x2716; {/* Close icon */}
              </button>
            </h1>
            <Form>
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
            <Button onClick={togglePopup}>Close Popup</Button>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default WaitlistPopup;
