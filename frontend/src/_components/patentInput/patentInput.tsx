import React, { ChangeEvent } from 'react';
import styles from './style.module.css';
import SearchBar from '../search/searchBar';

interface PatentInputProps {
    handleDownload: (patentNumbers: string[]) => Promise<void>;
    notFoundPatents: string[];
    loading: boolean;
    patents: string[]
    handleFormSubmit: () => Promise<void>;
    handleRemoveBox: (index: number) => void;
    handlePatentChange: (index: number, value: string) => void;
    handleInputChange: (value: string) => void;
}

const PatentInput: React.FC<PatentInputProps> = ({ handleDownload, notFoundPatents, loading, patents, handleFormSubmit, handleRemoveBox, handleInputChange, handlePatentChange }) => {
    const handleDownloadClick = async () => {
        await handleDownload(patents);
    };

    return (
        <div>
            <SearchBar onInput={handleInputChange} handleButtonClick={handleFormSubmit} placeholder='Input Patent Numbers, each one seperated by comma.' buttonText={"Lock In"} />
            <div className={styles.boxContainer}>
                {patents.map((patentNumber, index) => (
                    <div key={index} className={styles.inputBox}>
                        <input
                            type="text"
                            value={patentNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePatentChange(index, e.target.value)}
                            className={styles.patentInput}
                        />
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => handleRemoveBox(index)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            {patents.length > 0 && (
                <button
                    className={styles.downloadButton}
                    onClick={handleDownloadClick}
                    disabled={loading || patents.length === 0}
                >
                    {loading ? 'Downloading...' : 'Download'}
                </button>
            )}
            {notFoundPatents.length > 0 && (
                <div className={styles.notFoundContainer}>
                    <h3>Patents Not Found:</h3>
                    <ul>
                        {notFoundPatents.map((patent, index) => (
                            <li key={index}>{patent}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PatentInput;
