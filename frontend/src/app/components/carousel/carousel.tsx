import React from "react";
import CarouselRaw from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Carousel: any = CarouselRaw; // Bypass TypeScript checks with any

export const StatsCarousel = () => {

  return (
    <Carousel responsive={responsive}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </Carousel>
  );
};
