import styled from 'styled-components';

export const StyledNav = styled.nav`
  font-size: 18px;
  position: sticky;
  top: 0;
  z-index: 999;
  height: 80px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff; /* White */
`;

export const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
`;

export const StyledLi = styled.li`
  margin: 0 1rem;

  a {
    color: #000000; /* White */
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LogoText = styled.p`
  color: #000000; /* Black */
  margin: 0;
  font-weight: bold;
`;