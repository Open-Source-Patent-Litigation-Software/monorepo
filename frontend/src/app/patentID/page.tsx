"use client";
import React, { useId, useState } from "react";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import { useIDSearch } from "@/hooks/useIDSearch";
import "../tool/styles.css";


const Index = () => {
    const [query, setQuery] = useState<string>("");
    const {
        patentsLoading,
        patentList,
        search
    } = useIDSearch();

    const handleSearch = () => {
        search(query)
    }

    return (
        <>
            <div className="colored-div">
                <Navbar />
                <div className="animation-container">
                    <div className="search-container">
                        <h2 className="search-bar-title">Search Patents</h2>
                        <textarea
                        className="search-textarea"
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="type patent id numbers here"
                        />
                        <button className="search-button" onClick={handleSearch}>
                        Search
                        </button>
                    </div>
                    {patentsLoading && (
                        <h1>
                            Loading
                        </h1>
                    )}
                    {!patentsLoading && patentList != null && (
                        <h1>
                            Patents List
                        </h1>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Index;