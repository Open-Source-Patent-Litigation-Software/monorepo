import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center; // Centers the search bar and button horizontally
  align-items: center;
  gap: 10px; // Spacing between the input and the button
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); // Adds shadow around the container
  border-radius: 20px; // Optional: Adds rounded corners to the container
  background: white; // Ensures the shadow has a clear contrast
  margin: 5% 25% 5% 25%; // Adds margin around the container
  padding: 20px; // Adds padding inside the container
`;

// Styled input field
export const SearchInput = styled.input`
  padding: 10px 20px;
  border-radius: 20px; // Fully rounded ends
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1); // White shadow for depth
  width: 300px; // Specific width, adjust as needed
`;

// Styled button
export const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px; // Matching rounded ends
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #333; // Darker on hover
    color: #ddd; // Lighter text on hover
  }
`;
export const ColoredDiv = styled.div`
  background: linear-gradient(180deg, rgba(34,0,255,0.05) 0%, rgba(255,255,255,1) 50%, rgba(34,0,255,0.05) 100%);   
  min-height: 100vh; /* Minimum full viewport height */
`;