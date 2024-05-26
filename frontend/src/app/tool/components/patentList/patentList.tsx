import React from "react";
import {
  Container,
} from "./styles";
import Patent from "./patent";

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
  items: PatentItem[];
}

// PatentList component definition
const PatentList: React.FC<PatentListProps> = ({ items }) => {
  return (
    <Container>
      {items.map((item) => (
        <Patent item={item}/>
      ))}
    </Container>
  );
};

export default PatentList;
