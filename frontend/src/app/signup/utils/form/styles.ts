import styled,{keyframes} from 'styled-components';

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const FormContainer = styled.div`
  width: 60%;
  padding: 20px;
  border-radius: 10px;
  background-color: #4f6f52;
  margin-top: -10%;
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-in;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const FormTitle = styled.h1`
  text-align: center;
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 3rem;
`;

export const FormDescription = styled.h3`
  text-align: center;
  color: #f5efe6;
  margin-bottom: 10px;
`;

export const HR = styled.hr`
  margin-bottom: 10px;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #e8dfca;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #f5efe6;
  background-color: #1a4d2e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #153c24;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;

  h2 {
    margin-bottom: 20px; /* Add margin to increase space below the heading */
  }

  p {
    margin-bottom: 30px; /* Add margin to increase space below the paragraph */
  }

  button {
    width: 100%;
  }
`;

export const HaveAccount = styled.h1`
  text-align: center;
  color: #f5efe6;
  margin-top: 50px;
  font-size: 2rem;
`;

export const SignInLink = styled.span`
  a {
    color: inherit;
    text-decoration: underline;
    font-size: 2rem;
    padding-left: 20px;
    transition: color 0.3s ease, font-size 0.3s ease;
    &:hover {
      color: #ffffff;
      font-size: 2.1rem;
    }
  }
`;