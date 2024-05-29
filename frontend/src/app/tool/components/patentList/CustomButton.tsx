// components/LoadingButton.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Button = styled.button<{ loading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #1A4D2E;
  color: white;
  cursor: pointer;
  opacity: ${({ loading }) => (loading ? 0.7 : 1)};
  pointer-events: ${({ loading }) => (loading ? 'none' : 'auto')};
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease, scale 0.3s;
  &:hover {
    background-color: #4F6F52;
    color: white;
    fadeIn: 0.3s;
    scale: 105%;
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
  position: absolute;
`;

interface CustomButtonProps {
  children: React.ReactNode;
  loading: boolean;
  handleClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, loading, handleClick }) => {
  return (
    <Button onClick={handleClick} loading={loading}>
      {loading ? <Spinner /> : children}
    </Button>
  );
};

export default CustomButton;
