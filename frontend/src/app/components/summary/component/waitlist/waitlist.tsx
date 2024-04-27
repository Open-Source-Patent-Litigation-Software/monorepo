import React, { useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${(props) =>
    props.out
      ? css`
          ${fadeOut} 0.3s forwards
        `
      : css`
          ${fadeIn} 0.3s forwards
        `};
`;

const Modal = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${(props) =>
    props.out
      ? css`
          ${fadeOut} 0.3s
        `
      : css`
          ${fadeIn} 0.3s, ${scaleUp} 0.3s
        `};
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

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
      <Button onClick={togglePopup}>Interested? Join our waitlist!</Button>
      {isOpen && (
        <Overlay out={!isOpen && isAnimating} onClick={handleClose}>
          <Modal ref={modalRef} out={!isOpen && isAnimating}>
            <h1>Join the Waitlist!</h1>
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
