"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
import PatentList from "./components/patentList/patentList";
import {
  SearchContainer,
  ColoredDiv,
  SearchTextArea,
  SearchButton,
  SearchBarTitle,
  AnimationContainer,
} from "./styles";
interface Error {
  message: string;
}
function Index() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [patentQuery, setPatentQuery] = useState("");
  const [backendUrl, setBackendUrl] = useState(
    process.env.NEXT_PUBLIC_DEV_BACKEND
  );

  const fetchData = async () => {
    try {
      // Append the patentQuery as a query parameter
      const url = new URL(`${backendUrl}/patents/makeQuery`);
      url.searchParams.append("search", patentQuery);
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data.results);
      console.log(data);
      setError("");
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setData(null);
    }
  };
  return (
    <>
      <ColoredDiv>
        <Navbar />
        <AnimationContainer>
          <SearchContainer>
            <SearchBarTitle>Search Patents</SearchBarTitle>
            <SearchTextArea
              onChange={(e) => setPatentQuery(e.target.value)}
              placeholder="Describe your invention in 500 words or less."
            />
            <SearchButton onClick={fetchData}>Search</SearchButton>
            {error && <div>Error: {error}</div>}
          </SearchContainer>
          {(() => {
            if (data) {
              return <PatentList items={data} />;
            } else {
              return (
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
                  What makes a good search? A good search query is around 500
                  words and details all the key inventive features of your idea.
                  <br />
                  <br />
                  We break your search into many categories so we can properly
                  analyze it. How does the search work? We use three specialized
                  artificial intelligence models to break down your search query
                  into categories and then analyze the patent landscape.
                </div>
              );
            }
          })()}
        </AnimationContainer>
      </ColoredDiv>
      <Footer />
    </>
  );
}

export default Index;
