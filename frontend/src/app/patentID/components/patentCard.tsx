import React from 'react';

interface PatentInfo {
    appDate: string;
    assignee: string;
    pubNum: string;
    summary: string;
    title: string;
}

const PatentCard: React.FC<PatentInfo> = ({ appDate, assignee, pubNum, summary, title }) => {
    return (
        <div style={styles.patentBox}>
            <h2 style={styles.boxTitle}>{title}</h2>
            <p style={styles.details}><span style={styles.boldedDetail}>Application Date:</span> {appDate}</p>
            <p style={styles.details}><span style={styles.boldedDetail}>Assignee:</span> {assignee}</p>
            <p style={styles.details}><span style={styles.boldedDetail}>Publication Number:</span> {pubNum}</p>
            <details>
                <summary style={styles.details}>Summary</summary>
                <p style={styles.abstract}>{summary}</p>
            </details>
        </div>
    );
};

const styles = {
    patentBox: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        margin: '10px 0',
        width: '100%',
        animation: 'fadeIn 1s ease-out',
    },
    boxTitle: {
        color: '#333',
        marginBottom: '10px',
    },
    abstract: {
        color: '#666',
    },
    details: {
        color: '#333',
    },
    boldedDetail: {
        fontWeight: 'bold',
    },
    '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    }
};

export default PatentCard;
