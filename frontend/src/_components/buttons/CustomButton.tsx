import React from 'react';
import './button.css';

interface CustomButtonProps {
  children: React.ReactNode;
  loading: boolean;
  handleClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, loading, handleClick }) => {
  return (
    <button onClick={handleClick} className={`button ${loading ? 'loading' : ''}`}>
      {loading ? <div className="spinner" /> : children}
    </button>
  );
};

export default CustomButton;
