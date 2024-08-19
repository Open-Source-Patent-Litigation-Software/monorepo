'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../_components/navbar/navbar';
import { Footer } from '../../_components/footer/footer';
import styles from '../zip/style.module.css';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import PatentInput from '@/_components/patentInput/patentInput';

interface PatentSummary {
    filing_date: string;
    patent: string;
    summary: string;
    title: string;
}

const Index: React.FC = () => {
    const [patentQuery, setPatentQuery] = useState<string>('');
    const [patents, setPatents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notFoundPatents, setNotFoundPatents] = useState<string[]>([]);
    const [additionalData, setAdditionalData] = useState<string | null>(null);

    const generateDocX = async (bulkSummaries: PatentSummary[]): Promise<void> => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: bulkSummaries.flatMap((patent) => [
                    new Paragraph({
                        children: [new TextRun({ text: 'Patent Number: ', bold: true }), new TextRun(patent.patent)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'Title: ', bold: true }), new TextRun(patent.title)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'Filing Date: ', bold: true }), new TextRun(patent.filing_date)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: 'Summary: ', bold: true }), new TextRun(patent.summary)],
                    }),
                    new Paragraph(''),  // Empty paragraph for spacing
                ]),
            }],
        });

        try {
            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'patent_summaries.docx');
            console.log('Document generated and saved');
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    const handleDownload = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/bulk?patent_ids=${encodeURIComponent(JSON.stringify(patents))}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.summaries && Array.isArray(data.summaries)) {
                await generateDocX(data.summaries);
            } else {
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error fetching summaries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async () => {
        const values = patentQuery.split(/[\n,]/).map(value => value.trim()).filter(value => value !== '');
        setPatents([...values]);
        setNotFoundPatents([]);
        setAdditionalData('');
    };

    const handleRemoveBox = (index: number) => {
        const values = [...patents];
        values.splice(index, 1);
        setPatents(values);
    };

    const handlePatentChange = (index: number, value: string) => {
        const values = [...patents];
        values[index] = value;
        setPatents(values);
    };

    const handleInputChange = (value: string) => {
        setPatentQuery(value);
    };

    useEffect(() => {
        if (additionalData) {
            alert(additionalData);
        }
    }, [additionalData]);

    return (
        <>
            <div className={styles.colored_div}>
                <Navbar />
                <div className={styles.container}>
                    <h1 className={styles.heading}>Bulk Summary Download</h1>
                    <PatentInput
                        notFoundPatents={notFoundPatents}
                        handleDownload={handleDownload}
                        handleFormSubmit={handleFormSubmit}
                        handleInputChange={handleInputChange}
                        handlePatentChange={handlePatentChange}
                        handleRemoveBox={handleRemoveBox}
                        patents={patents}
                        loading={isLoading}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '50%',
                        textAlign: 'center',
                        justifyItems: 'center',
                        margin: 'auto',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                    }}
                >
                    Bulk summaries is a feature to generate summaries for multiple patents at once. Enter the patent IDs separated by commas and click on the &quot;Add Patents&quot; button to download the summaries in a Word document.
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;