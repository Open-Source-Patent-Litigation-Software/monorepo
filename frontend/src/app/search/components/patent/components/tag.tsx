import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Tag: React.FC<TagProps> = ({ label, selected, onClick }) => {
  return (
    <div
      className={`${styles.tag} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Tag;
