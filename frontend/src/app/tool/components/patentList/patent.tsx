"use client";
import React, { useState } from "react";
import LoadingButton from "./analyzeButton";
import styled from 'styled-components';

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
}

export const data = {
  labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
  datasets: [
    {
      label: '# of Votes',
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

// PatentList component definition
const Patent: React.FC<PatentListProps> = ({ item }) => {
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    try {
      setIsAnalyzed(true);
    } catch {
      // Handle the Error
    }
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
            <Radar data={data} />
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
