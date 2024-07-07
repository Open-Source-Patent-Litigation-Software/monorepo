"use client";
import React, { useState } from "react";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import { useIDSearch } from "@/hooks/useIDSearch";
import PatentCard from "./components/patentCard";
import "../tool/styles.css";
import "../tool/components/patent/patent.css";
import { patentbyID } from "@/types/types";


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
                    {!patentsLoading && patentList && (
                        patentList.map((patent: patentbyID) => (
                            <div className="container">
                                <PatentCard appDate={patent.applicationDate} assignee={patent.assignee} pubNum={patent.assignee} summary={patent.summary} title={patent.title}/>
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
