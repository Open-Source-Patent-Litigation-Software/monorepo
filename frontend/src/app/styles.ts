import styled from 'styled-components';

export const SnapScrollContainer = styled.div`
  height: 100vh; /* Full viewport height */
  overflow-y: scroll; /* Enable vertical scrolling */
  scroll-snap-type: y mandatory; /* Enable snap scrolling on the y-axis */
  /* Ensure it takes up the full width to prevent unexpected behavior */
  width: 100%;
`;

export const DivView = styled.div`
  display: flex;
  background-color: #f0f0f0; /* Light grey */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  scroll-snap-align: start; /* Align the top of the element with the snap container's scrollport */
  width: 100%; /* Ensure it takes up the full width */
`;