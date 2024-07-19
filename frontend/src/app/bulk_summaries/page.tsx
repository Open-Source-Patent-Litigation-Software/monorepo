"use client";

import React, { useState } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import LoadingSpinner from "../search/components/loading/loadingSpinner";
import styles from "../search/styles.module.css";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface PatentSummary {
    filing_date: string;
    patent: string;
    summary: string;
    title: string;
}

const Index: React.FC = () => {
    const [patentQuery, setPatentQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const generateDocX = async (bulkSummaries: PatentSummary[]): Promise<void> => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: bulkSummaries.flatMap((patent) => [
                    new Paragraph({
                        children: [new TextRun({ text: "Patent Number: ", bold: true }), new TextRun(patent.patent)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Title: ", bold: true }), new TextRun(patent.title)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Filing Date: ", bold: true }), new TextRun(patent.filing_date)],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Summary: ", bold: true }), new TextRun(patent.summary)],
                    }),
                    new Paragraph(""),  // Empty paragraph for spacing
                ]),
            }],
        });

        try {
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "patent_summaries.docx");
            console.log("Document generated and saved");
        } catch (error) {
            console.error("Error generating document:", error);
        }
    };

    const handleDownload = async (): Promise<void> => {
        setIsLoading(true);
        setProgress(0);
        const patentIds = patentQuery.split(",").map((id) => id.trim());

        const eventSource = new EventSource(`/api/bulk?patent_ids=${encodeURIComponent(JSON.stringify(patentIds))}`);

        const bulkSummaries: PatentSummary[] = [];

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            bulkSummaries.push(data);
            console.log("Received summary:", bulkSummaries);
            setProgress(bulkSummaries.length);
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setIsLoading(false);
        };

        eventSource.addEventListener('close', async () => {
            eventSource.close();
            setIsLoading(false);
            await generateDocX(bulkSummaries);
        });
    };

    return (
        <>
            <div className={styles.colored_div}>
                <Navbar />
                <div className={styles.animation_container}>
                    <div className={styles.search_container}>
                        <h2 className={styles.search_bar_title}>Bulk{"\n"}Summaries</h2>
                        <div className={styles.search_input_wrapper}>
                            <textarea
                                className={styles.search_textarea}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPatentQuery(e.target.value)}
                                placeholder="Enter patent IDs, separated by commas."
                            />
                            <button
                                className={styles.search_button}
                                onClick={handleDownload}
                                disabled={isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate Document"}
                            </button>
                        </div>
                    </div>
                    {isLoading && (
                        <div>
                            <LoadingSpinner />
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "50%",
                        textAlign: "center",
                        justifyItems: "center",
                        margin: "auto",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    }}
                >
                    Bulk summaries is a feature to generate summaries for multiple patents at once. Enter the patent IDs separated by commas and click on the &quot;Generate Summaries&quot; button to download the summaries in a Word document.
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;