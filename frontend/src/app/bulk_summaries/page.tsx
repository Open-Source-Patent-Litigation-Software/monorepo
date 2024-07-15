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

        try {
            const response = await fetch("/api/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patent_ids: patentQuery.split(",").map((id) => id.trim()),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const bulkSummaries: PatentSummary[] = data.summaries;
                console.log("API Response:", bulkSummaries);
                await generateDocX(bulkSummaries);
            } else {
                console.error("Failed to generate summary document, Response status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
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
                                {isLoading ? "Generating..." : "Generate Summaries"}
                            </button>
                        </div>
                    </div>
                    {isLoading && <LoadingSpinner />}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;
