'use client';

import { useState } from 'react';

const HomePage = () => {
    const [patentIds, setPatentIds] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [additionalData, setAdditionalData] = useState<string | null>(null);
    const [notFoundPatents, setNotFoundPatents] = useState<string[]>([]);

    const handleDownload = async () => {
        setIsLoading(true);
        setAdditionalData(null);
        setNotFoundPatents([]);
        try {
        const response = await fetch('/api/zip', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patent_ids: patentIds.split(',').map(id => id.trim()) }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'patents.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();

            const additionalDataHeader = response.headers.get('Additional-Data');
            if (additionalDataHeader) {
            const additionalDataJson = JSON.parse(additionalDataHeader);
            setAdditionalData(additionalDataJson.message);
            setNotFoundPatents(additionalDataJson.not_found);
            }
        } else {
            console.error('Failed to download patents');
        }
        } catch (error) {
        console.error('Error:', error);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div>
        <h1>Patent PDF Downloader</h1>
        <input
            type="text"
            value={patentIds}
            onChange={(e) => setPatentIds(e.target.value)}
            placeholder="Enter patent IDs, separated by commas"
        />
        <button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? 'Downloading...' : 'Download PDFs'}
        </button>
        {additionalData && <p>{additionalData}</p>}
        {notFoundPatents.length > 0 && (
            <div>
            <p>The following patents could not be found:</p>
            <ul>
                {notFoundPatents.map((patentId, index) => (
                <li key={index}>{patentId}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default HomePage;
