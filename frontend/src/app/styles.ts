import styled from 'styled-components';
import { devices } from './sizes';
export const SnapScrollContainer = styled.div`
  overflow-y: scroll; /* Enable vertical scrolling */
  scroll-snap-type: y mandatory; /* Enable snap scrolling on the y-axis */
  /* Ensure it takes up the full width to prevent unexpected behavior */
  width: 100%;
  background: rgb(34,0,255);
  background: #E8DFCA;   
`;

export const DivView = styled.div<{ paddingTop?: string; color?: string }>`
  display: flex;
  padding-top: ${(props) => props.paddingTop || '10%'};
  padding-bottom: 5%;
  background: ${(props) => props.color || '#F5EFE6'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 110vh;
  scroll-snap-align: start; /* Align the top of the element with the snap container's scrollport */
  width: 100%; /* Ensure it takes up the full width */
`;