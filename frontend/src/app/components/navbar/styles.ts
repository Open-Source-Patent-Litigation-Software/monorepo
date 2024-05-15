import styled from 'styled-components';

export const StyledNav = styled.nav`
  font-size: 18px;
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
  z-index: 999;
  height: 80px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3); /* Increased shadow */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #153C24; /* Dark green */
`;

export const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
`;

export const StyledLi = styled.li`
  margin: 0 1rem;

  a {
    color: #FFFFFF; /* White */
    text-decoration: none;
    transition: font-weight 0.3s ease, color 0.3s ease, font-size 0.3s ease; /* Adding transition for font-size */
    
    &:hover {
      font-weight: bold;
      font-size: 20px;
    }
  }
`;

export const LogoText = styled.p`
  color: #000000; /* Black */
  margin: 0;
  font-weight: bold;
`;
