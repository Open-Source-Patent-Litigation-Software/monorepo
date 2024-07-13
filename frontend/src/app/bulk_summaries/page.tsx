"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import LoadingSpinner from "../search/components/loading/loadingSpinner";
import styles from "../search/styles.module.css";

const Index = () => {
    const [patentQuery, setPatentQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = async () => {
        setIsLoading(true);

        const generateDocX = async () => {
            console.log("Generating docx");
        };

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
                console.log("Successfully generated summary document");
            } else {
                console.error("Failed to generate summary document");
            }
        } catch (error) {
            console.error("Error:", error);
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
                                onChange={(e) => setPatentQuery(e.target.value)}
                                placeholder="Enter patent IDs, separated by commas."
                            />
                            <button
                                className={styles.search_button}
                                onClick={handleDownload}
                                disabled={isLoading}
                            >
                                {isLoading ? "Downloading..." : "Download PDFs"}
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
