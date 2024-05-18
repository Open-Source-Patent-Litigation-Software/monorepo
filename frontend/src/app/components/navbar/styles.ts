import styled from 'styled-components';

export const StyledNav = styled.nav`
  font-size: 18px;
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 0;
  z-index: 999;
  height: 80px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #153C24;
  padding: 0 20px;
`;

export const LoginLink = styled.a`
  color: white;
  background-color: #4f6f52;
  text-decoration: none;
  padding: 10px;
  transition: font-weight 0.3s ease, color 0.3s ease, font-size 0.3s ease;
  &:hover {
    font-weight: bold;
    font-size: 25px;
  }
`;

export const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
`;

export const StyledLi = styled.li`
  margin: 0 1rem;

  a {
    color: #FFFFFF;
    text-decoration: none;
    transition: font-weight 0.3s ease, color 0.3s ease, font-size 0.3s ease;

    &:hover {
      font-weight: bold;
      font-size: 25px;
    }
  }
`;

export const LogoText = styled.p`
  color: #FFFFFF;
  margin: 0;
  font-size: 30px;
  font-weight: bold;

  a {
    color: inherit;
    text-decoration: none;
    transition: font-weight 0.3s ease, color 0.3s ease, font-size 0.3s ease;
 
    &:hover {
      color: inherit;
      text-decoration: none;
      font-size: 35px;
    }
  }
`;
