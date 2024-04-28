// styles.js
import styled, { keyframes, css } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const scaleUp = keyframes`
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
`;

interface OverlayProps {
  out?: boolean;
}

export const Overlay = styled.div<OverlayProps>`
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

interface ModalProps {
  out?: boolean;
}

export const Modal = styled.div<ModalProps>`
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
          ${fadeOut} 0.3s forwards
        `
      : css`
          ${fadeIn} 0.3s, ${scaleUp} 0.3s
        `};
`;

export const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const WaitlistButton = styled(Button)`
  background-color: white;
  margin: 5% 0% 0% 0%;
  font-weight: bold;
  color: black;
  font-size: 2rem;
  border: 2px solid black;
  border-radius: 15px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: blue;
    color: white;
    fadeIn: 0.3s;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-size: 16px;
`;

export const Input = styled.input`
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;