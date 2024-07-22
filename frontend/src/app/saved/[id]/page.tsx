"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Navbar } from "@/_components/navbar/navbar";
import { Footer } from "@/_components/footer/footer";
import styles from "./styles.module.css";
import { Patent } from "../types";
const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [patents, setPatents] = useState<Patent[]>([]);
  const params = useParams();
  const removePatent = (id: string) => {
    setPatents((prevPatents) => {
      const updatedPatents = prevPatents.filter(
        (patent) => patent.patentInfo.id !== id
      );
      return updatedPatents;
    });
  };

  return (
    <>
      <div className={styles.coloredDiv}>
        <Navbar />
        <div className={styles.infoPanel}>
          Viewing Information For: {params.id}
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Page;
