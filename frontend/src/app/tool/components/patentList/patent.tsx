import React from "react";
import {
  Container,
  PatentBox,
  BoxTitle,
  Abstract,
  Details,
  PatentLink,
  InventorList,
  InventorItem,
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
  items: PatentItem[];
}

// PatentList component definition
const PatentList: React.FC<PatentListProps> = ({ items }) => {
  return (
    <Container>
      {items.map((item) => (
        <PatentBox key={item.id}>
          <BoxTitle>
            {item.title} ({item.type})
          </BoxTitle>
          <Abstract>{item.abstract}</Abstract>
          <Details>Owned by: {item.owner}</Details>
          <Details>Publication Date: {item.publication_date}</Details>
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
        </PatentBox>
      ))}
    </Container>
  );
};

export default PatentList;
