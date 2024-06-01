import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <Container>
      <Spinner />
    </Container>
  );
};

export default LoadingSpinner;
