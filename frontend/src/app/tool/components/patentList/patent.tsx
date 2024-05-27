"use client";
import React, { useState } from "react";
import LoadingButton from "./analyzeButton";
import styled from 'styled-components';
import { ChartData } from "chart.js";

import {
  PatentBox,
  BoxTitle,
  Abstract,
  Details,
  PatentLink,
  InventorList,
  InventorItem,
  BoldedDetail,
  Wrapper,
  ChartContainer,
} from "./styles";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PatentItem {
  abstract: string;
  alias: string;
  id: string;
  image: string;
  index: string;
  inventors: string[];
  mapping: null; // Assuming no further details are available
  owner: string;
  publication_date: string;
  publication_id: string;
  score: number;
  snippet: null | string; // Assuming snippet can be null or string
  title: string;
  type: string;
  www_link: string;
}

interface PatentListProps {
  item: PatentItem;
  searchMetrics: string[];
  search: string;
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

interface DataState {
  labels: string[];
  datasets: Dataset[];
}

const initialData: DataState = {
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

function concatenateWithComma(list: string[]): string {
  return list.join(', ');
}

// PatentList component definition
const Patent: React.FC<PatentListProps> = ({ item, searchMetrics, search }) => {
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState(
    process.env.NEXT_PUBLIC_DEV_BACKEND
  );
  const [data, setData] = useState<DataState>(initialData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const concatMetrics = concatenateWithComma(searchMetrics);
      const formattedSearch = {
        search: search,
        user: "user",
        patentURL: item.www_link,
        metrics_str: concatMetrics
      };

      const metricsURL = new URL(`${backendUrl}/llm/extractSpecificPatentMetrics`);
      const metricsResponse = await fetch(metricsURL.toString(), {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(formattedSearch), // Convert data to JSON string
      });

      if (!metricsResponse.ok) {
        throw new Error(`HTTP error! status: ${metricsResponse.status}`);
      }
      const metricsData = await metricsResponse.json();

      const newDataSet: Dataset = {
        label: "% similar",
        data: Object.values(metricsData),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      };
      const newData: DataState = {
        labels: Object.keys(metricsData),
        datasets: [
          newDataSet,
        ]
      };
      console.log(newData)
      setData(newData);
      setIsAnalyzed(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertToChartData = (data: DataState): ChartData<'radar', number[], string> => {
    return {
      labels: data.labels,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
      })),
    };
  };

  return (
    <PatentBox key={item.id}>
      <BoxTitle>
        {item.title} ({item.type})
      </BoxTitle>
      <Abstract>{item.abstract}</Abstract>
      <Details>
        <BoldedDetail>Owned by:</BoldedDetail> {item.owner}
      </Details>
      <Details>
        <BoldedDetail>Publication Date:</BoldedDetail>{" "}
        {item.publication_date}
      </Details>
      <Details>
        <BoldedDetail>Patent Number:</BoldedDetail> {item.publication_id}
      </Details>
      <PatentLink
        href={item.www_link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Patents Link
      </PatentLink>
      {item.inventors && (
        <InventorList>
          {item.inventors.map((inventor) => (
            <InventorItem key={inventor}>{inventor}</InventorItem>
          ))}
        </InventorList>
      )}
      <Wrapper>
        {isAnalyzed ? 
          <ChartContainer>
            <Radar data={convertToChartData(data)} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartContainer>
         : 
          <LoadingButton loading={loading} handleClick={fetchData}>
            Analyze
          </LoadingButton>
         }
      </Wrapper>
    </PatentBox>
  );
};

export default Patent;
