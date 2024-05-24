import styled, { keyframes } from "styled-components";

// Define the fade-in animation using keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; // Spacing between each patent box
  margin: 5%;
  margin-bottom: 0;
  padding-bottom:5%;
  animation: ${fadeIn} 1s ease-out; // Apply the animation to the container
`;
export const PatentBox = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); // Small shadow
  padding: 20px;
  margin: 10px 0;
  animation: ${fadeIn} 1s ease-out; // Apply the animation to each patent box
`;

export const BoxTitle = styled.h2`
  color: #333; // Dark gray for text
  margin-bottom: 10px;
`;

export const Abstract = styled.p`
  color: #666; // Lighter gray for abstract text
`;

export const Details = styled.p`
  color: #333;
`;
export const BoldedDetail = styled.span`
  font-weight: bold;
`

export const PatentLink = styled.a`
  color: #0077cc; // Link color
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const InventorList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const InventorItem = styled.li`
  color: #333;
`;
