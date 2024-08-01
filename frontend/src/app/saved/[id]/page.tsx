"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Navbar } from "@/_components/navbar/navbar";
import { Footer } from "@/_components/footer/footer";
import styles from "./styles.module.css";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
};

interface PatentInfo {
  abstract: string;
  inventors: string[];
  owner: string;
  publication_date: string;
  publication_id: string;
  score: {
    scores: number[];
    total: number;
  };
  title: string;
  www_link: string;
}

interface Citations {
  [key: string]: {
    abstract: { before: string; highlight: string; after: string }[];
    claims: { before: string; highlight: string; after: string }[];
    description: string | null;
  };
}

interface Percentages {
  [key: string]: number;
}

interface Patent {
  patentInfo: PatentInfo;
  search: string;
  citations: Citations;
}

const Page: React.FC = () => {
  const [patent, setPatent] = useState<Patent | null>(null);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const params = useParams();

  useEffect(() => {
    const fetchSavedPatents = async () => {
      try {
        const response = await fetch("/api/fetch_one_patent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patent_neon_id: params.id,
          }),
        });
        const data = await response.json();
        console.log("patent-data:", data);
        setPatent(data.patent);

        const scores = data.patent.patentInfo.score.scores;
        const labels = scores.map((_: number, index: number) => `Feature ${index + 1}`);
        const chartDataValues = scores;

        const newChartData = {
          labels: labels,
          datasets: [
            {
              label: "Differential Score",
              data: chartDataValues,
              fill: true,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgb(255, 99, 132)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
            },
          ],
        };

        setChartData(newChartData);
      } catch (error) {
        console.error("Error fetching saved patents:", error);
      }
    };
    fetchSavedPatents();
  }, [params.id]);

  if (!patent) {
    return <div>Loading...</div>;
  }

  const { patentInfo, search, citations } = patent;

  return (
    <>
      <div className={styles.coloredDiv}>
        <Navbar />
        <div className={`${styles.infoPanel} ${styles.animationContainer}`}>
          <div className={styles.patentDetails}>
            <h1 className={styles.patentTitle}>{patentInfo.title}</h1>
            <p>
              <strong>Inventors:</strong> {patentInfo.inventors.join(", ")}
            </p>
            <p>
              <strong>Owner:</strong> {patentInfo.owner}
            </p>
            <p>
              <strong>Publication Date:</strong>{" "}
              {new Date(patentInfo.publication_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Abstract:</strong> {patentInfo.abstract}
            </p>
            <p>
              <strong>Search Term:</strong> {search}
            </p>
            <div>
              <a
                href={patentInfo.www_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Patents
              </a>
            </div>
          </div>
          <div className={styles.percentages}>
            <h3>Feature Percentages</h3>
            {chartData.labels.length > 0 && (
              <Radar data={chartData} options={options} />
            )}
          </div>
          {/* TODO: IMPLEMENT CITATIONS */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
