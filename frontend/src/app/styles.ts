import styled from 'styled-components';

export const StyledMain = styled.main`
  width: 100%;
  min-height: 100vh; // Main-tag takes the full height of the viewport
  display: flex;
  flex-direction: column;
  align-items: stretch; // Make sure that child elements can stretch to the full width if they are set to do so
`;
