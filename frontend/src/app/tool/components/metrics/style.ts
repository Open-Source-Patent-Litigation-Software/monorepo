import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 20px;
  flex-wrap: wrap;
`;

export const Metric = styled.div`
  display: flex;
  align-items: center;
  margin: 0 20px 20px 0; /* Increase the space between boxes */
`;

export const Button = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff4500;
  }
`;

export const AddButton = styled(Button)`
display: inline-flex;
align-items: center;
justify-content: center;
padding: 10px 20px;
font-size: 16px;
border: none;
border-radius: 5px;
background-color: #1A4D2E;
color: white;
cursor: pointer;
position: relative;
transition: background-color 0.3s ease, color 0.3s ease, scale 0.3s;
&:hover {
  background-color: #4F6F52;
  color: white;
  fadeIn: 0.3s;
  scale: 105%;
}
`;

export const TextArea = styled.textarea`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 200px; 
  height: 100px;
  resize: none;
  overflow-wrap: break-word;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4500;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
  transition: scale 0.3s;

  &:hover {
    color: #ff0000;
    scale: 120%;
  }
`;
