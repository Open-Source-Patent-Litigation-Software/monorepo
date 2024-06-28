import React, { useState, useEffect } from 'react';

interface SummaryComponentProps {
    getSummary: () => Promise<void>;
    summary: string;
    summaryLoading: boolean;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({ getSummary, summary, summaryLoading }) => {
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        if (summary) {
        setShowSummary(true);
        }
    }, [summary]);

    const handleButtonClick = async () => {
        setShowSummary(false); // Reset the summary visibility
        await getSummary();
    };

    return (
        <div>
        {!showSummary && (
            <button onClick={handleButtonClick} disabled={summaryLoading}>
                {summaryLoading ? 'Loading...' : 'Show Summary'}
            </button>
        )}
        {showSummary && (
            <div className="summary">
            <h2>Summary</h2>
            <p>{summary}</p>
            </div>
        )}
        </div>
    );
};

export default SummaryComponent;
