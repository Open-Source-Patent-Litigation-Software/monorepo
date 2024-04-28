import styled, { keyframes } from 'styled-components';
import { devices } from '@/app/sizes';

// home styling
const flyInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
`;

const flyInFromRight = keyframes`
  from {
    transform: translateX(300%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
`;

export const Title = styled.p`
  font-size: 6em; // Default font size for all screen sizes
  text-align: center;
  font-weight: bold;
  animation: ${flyInFromLeft} 1s ease-out forwards;
  margin: 0 1em 0 1em;
  @media ${devices.tablet} {
    font-size: 5.5em;
  }
  @media ${devices.laptop} {
    font-size: 6.5em;
  }
  @media ${devices.laptopL} {
    font-size: 6em;
  }
  @media ${devices.desktop} {
    font-size: 8.5em;  }
`;

export const BlueSwipe = styled.span`
  color: blue;
`;

export const SummaryDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5%;
`;

export const InlineContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;