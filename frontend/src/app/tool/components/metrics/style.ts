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
  margin-top: 20px;
  background-color: #28a745;

  &:hover {
    background-color: #218838;
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
