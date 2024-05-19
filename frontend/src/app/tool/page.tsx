"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/navbar/navbar";
import { Footer } from "../components/footer/footer";
import PatentList from "./components/patentList/patent";
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
              placeholder="Enter patent description!"
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
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Example Query: "A device that brews coffee."
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
