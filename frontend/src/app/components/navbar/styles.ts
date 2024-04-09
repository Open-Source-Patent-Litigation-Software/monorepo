import styled from 'styled-components';

export const StyledNav = styled.nav`
  background-color: #004d40; /* Deep teal */
  padding: 1rem;
`;

export const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 0;
`;

export const StyledLi = styled.li`
  margin: 0 1rem;

  a {
    color: #ffffff; /* White */
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
