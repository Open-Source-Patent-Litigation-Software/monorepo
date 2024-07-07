import React from "react";
import styles from "./button.module.css";

interface CustomButtonProps {
  children: React.ReactNode;
  loading: boolean;
  handleClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  loading,
  handleClick,
}) => {
  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${loading ? styles.loading : ""}`}
    >
      {loading ? <div className={styles.spinner} /> : children}
    </button>
  );
};

export default CustomButton;
