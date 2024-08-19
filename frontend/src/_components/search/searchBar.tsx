import { ChangeEvent } from 'react';
import styles from './style.module.css';

interface SearchBarProps {
    handleButtonClick: () => Promise<void>;
    placeholder: string;
    onInput: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onInput, handleButtonClick, placeholder, buttonText }) => {
    return (
        <div className={styles.search_container}>
            <textarea
                className={styles.search_textarea}
                onChange={(e) => onInput(e.target.value)}
                placeholder={placeholder}
            />
            <button
                className={styles.search_button}
                onClick={handleButtonClick}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default SearchBar;