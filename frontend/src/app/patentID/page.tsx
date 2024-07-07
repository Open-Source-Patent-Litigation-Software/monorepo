"use client";
import React, { useState } from "react";
import { Navbar } from "../../_components/navbar/navbar";
import { Footer } from "../../_components/footer/footer";
import { useIDSearch } from "@/hooks/useIDSearch";
import PatentCard from "./components/patentCard";
import styles from "../search/styles.module.css"; // Updated import
import "../search/components/patent/patent.css";
import { patentbyID } from "@/types/types";

const Index = () => {
    const [query, setQuery] = useState<string>("");
    const {
        patentsLoading,
        patentList,
        search
    } = useIDSearch();

    const handleSearch = () => {
        search(query);
    }

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
                    {patentsLoading && (
                        <h1>
                            Loading
                        </h1>
                    )}
                    {!patentsLoading && patentList && (
                        patentList.map((patent: patentbyID) => (
                            <div className="container">
                                <PatentCard appDate={patent.applicationDate} assignee={patent.assignee} pubNum={patent.assignee} summary={patent.summary} title={patent.title} />
                            </div>
                        ))
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Index;
