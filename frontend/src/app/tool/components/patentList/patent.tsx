"use client";
import React from "react";
import { useState } from "react";
import RadarChart, {ChartData} from "react-svg-radar-chart";
import LoadingButton from "./analyzeButton"
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
} from "./styles";

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

type RadarChartData = {
  data: ChartData[];
  captions: {
    [key: string]: string
  }
};

// PatentList component definition
const Patent: React.FC<PatentListProps> = ({ item }) => {
  // const exampleRadarChartData: RadarChartData = {
  //   data: [
  //     {
  //       data: {
  //       },
  //       meta: { color: 'blue' }
  //     }
  //   ],
  //   captions: {
  //   }
  // };
  const exampleRadarChartData: RadarChartData = {
    data: [
      {
        data: {
          battery: 0.7,
          design: 0.8,
          useful: 0.9,
          speed: 0.67,
          weight: 0.8
        },
        meta: { color: 'blue' }
      }
    ],
    captions: {
      battery: 'Battery Life',
      design: 'Design',
      useful: 'Usefulness',
      speed: 'Speed',
      weight: 'Weight'
    }
  };
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [graphItems, setGraphItems] = useState<RadarChartData>(exampleRadarChartData);

  const fetchData = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    try {
      // const response = await fetch('https://api.example.com/data'); // TODO: fill in with Dev
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      // const result = await response.json();
      // const transformedData = transformData(result);
      // setGraphItems(transformedData);
      setIsAnalyzed(true);
    }
    catch {
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
          <RadarChart
            captions={graphItems?.captions}
            data={graphItems?.data}
            size={450}

          />
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
