import React, { useState } from 'react';
import styled from 'styled-components';

// Overlay background style
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
`;

// Popup modal style
const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  width: 50%; // You can adjust the width as per requirement
`;

// Button style
const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

// Popup component
const WaitlistPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={togglePopup}>Open Popup</Button>
      {isOpen && (
        <Overlay>
          <Modal>
            <p>This is a popup! You can put any content here.</p>
            <Button onClick={togglePopup}>Close Popup</Button>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default WaitlistPopup;
