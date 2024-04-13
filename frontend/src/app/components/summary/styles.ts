import styled, { keyframes } from 'styled-components';

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
    font-size: 7em;
    000000    text-align: center;
    font-weight: bold;
    animation: ${flyInFromLeft} 1s ease-out forwards;
    `;

export const Description = styled.p`
    font-size: 2.5em;
    color: #000000;
    text-align: center;
    animation: ${flyInFromRight} 1s ease-out forwards;
    `;

export const SummaryDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5%;
 // padding : top right bottom left
    margin: 0% 10% 10% 10%;
    `;

export const Form = styled.div`
    justify-content: center;
    align-items: center;
    padding: 0% 10% 0% 10%;
    animation: ${flyInFromRight} 1s ease-out forwards;
    `;