"use client";
import React, { useState } from "react";
import { Navbar } from "../components/navbar/navbar";
interface Error {
  message: string;
}
function Index() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [patentQuery, setPatentQuery] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch("url");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      setError("");
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setData(null);
    }
  };
  return (
    <main>
      <Navbar />
      <div>Tool</div>
      <div>
        <input
          type="text"
          onChange={(e) => setPatentQuery(e.target.value)}
          placeholder="Enter patent description"
        />
        <button onClick={fetchData}>Fetch Data</button>
        {data && (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        {error && <div>Error: {error}</div>}
      </div>
    </main>
  );
}

export default Index;
