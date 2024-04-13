"use client";
import React, { useState } from "react";
import { Navbar } from "../components/navbar/navbar";
import { SnapScrollContainer, DivView } from "../styles";
import { Footer } from "../components/footer/footer";
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
      // console.log(patentQuery);
      console.log(data);
      setData(data.searchQuery);
      setError("");
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setData(null);
    }
  };

  return (
    <SnapScrollContainer>
      <Navbar />
      <DivView>
        <div>Tool</div>
        <div>
          <input
            type="text"
            onChange={(e) => setPatentQuery(e.target.value)}
            placeholder="Enter patent description"
          />
          <button onClick={fetchData}>Fetch Data</button>
          {error && <div>Error: {error}</div>}
        </div>
        {data && <div>Data: {data}</div>}
      </DivView>
      <Footer />
    </SnapScrollContainer>
  );
}

export default Index;
