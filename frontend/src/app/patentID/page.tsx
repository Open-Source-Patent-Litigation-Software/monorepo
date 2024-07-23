"use client";
import React, { useState } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import { useIDSearch } from "@/hooks/useIDSearch";
import PatentCard from "./components/patentCard";
import styles from "../search/styles.module.css"; // Updated import
import { patentbyID } from "@/types/types";

const Index = () => {
    const [query, setQuery] = useState<string>("");
    const { patentsLoading, patentList, search } = useIDSearch();

    const handleSearch = () => {
        search(query);
    };

    return (
        <>
            <div className={styles.colored_div}>
                <Navbar />
                <div className={styles.animation_container}>
                    <div className={styles.search_container}>
                        <h2 className={styles.search_bar_title}>Search Patents</h2>
                        <textarea
                            className={styles.search_textarea}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="type patent id numbers here"
                        />
                        <button className={styles.search_button} onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                    {patentsLoading && <h1>Loading</h1>}
                    {!patentsLoading && patentList && (
                        <div className={styles.patent_list}>
                            {patentList.map((patent: patentbyID, index: number) => (
                                <div className="container" key={index}>
                                    <PatentCard
                                        appDate={patent.applicationDate}
                                        assignee={patent.assignee}
                                        pubNum={patent.assignee}
                                        summary={patent.summary}
                                        title={patent.title}
                                    />
                                </div>
                            ))}
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
                    Generate individual patent summaries by entering patent ID numbers.
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;
