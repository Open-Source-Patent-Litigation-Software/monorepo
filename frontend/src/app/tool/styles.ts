import styled,{keyframes} from 'styled-components';

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
export const SearchContainer = styled.div`
  display: flex;
  justify-content: center; // Centers the search bar and button horizontally
  align-items: center;
  gap: 10px; // Spacing between the input and the button
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); // Adds shadow around the container
  border-radius: 20px; // Optional: Adds rounded corners to the container
  background: white; // Ensures the shadow has a clear contrast
  margin: 5% 10%; // Adjusted margin for better centering
  padding: 20px; // Adds padding inside the container
`;

export const SearchTextArea = styled.textarea`
  padding: 10px 20px;
  border-radius: 20px; // Fully rounded ends
  width: 80%; // Specific width, adjust as needed
  height: 100px; // Set height to 100px
  resize: none; // Prevent resizing
  border: 1px solid #ccc; // Add a border for better visibility
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Light shadow for depth
`;
export const SearchBarTitle = styled.h2`
  margin: 0; // Remove default margin
  color: black; // Black text color
  font-size: 40px; // Larger font size
  margin-right: -10%;
  text-align: space-between;
`;
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
  background: #F5EFE6;
  padding-top: 5%;
  min-height: 110vh; /* Minimum full viewport height */
`;
export const AnimationContainer = styled.div`
  animation: ${fadeIn} 1s;
`;