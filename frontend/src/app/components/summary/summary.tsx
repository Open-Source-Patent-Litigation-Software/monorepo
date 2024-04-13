"use client";

import React from "react";
import { SummaryDiv, Title, Description, Form } from "./styles";

interface SummaryProps {
  // Your props here
}

export const Summary: React.FC<SummaryProps> = (props) => {
  return (
    <>
      <SummaryDiv>
        <Title>Welcome to EasyIP!</Title>
        <Description>
          We are here to make researching intellectual property seamless.
        </Description>
      </SummaryDiv>
      <Form>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi,
        explicabo aperiam deserunt animi veniam dolorum, voluptatem,
        perspiciatis veritatis cupiditate sapiente similique illum id assumenda
        quas incidunt eos sequi odit soluta. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Nisi, explicabo aperiam deserunt animi
        veniam dolorum, voluptatem, perspiciatis veritatis cupiditate sapiente
        similique illum id assumenda quas incidunt eos sequi odit soluta. Lorem,
        ipsum dolor sit amet consectetur adipisicing elit. Nisi, explicabo
        aperiam deserunt animi veniam dolorum, voluptatem, perspiciatis
        veritatis cupiditate sapiente similique illum id assumenda quas incidunt
        eos sequi odit soluta.
      </Form>
    </>
  );
};
