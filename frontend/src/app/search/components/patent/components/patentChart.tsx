import React from "react";
import { Radar } from "react-chartjs-2";
import { PatentChartProps } from "@/types/types";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

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
              display: false
          },
          suggestedMin: 0,
          suggestedMax: 10
      }
    }
  }

const PatentChart: React.FC<PatentChartProps> = ({ data }) => {
    return <Radar data={data} options={options}/>;
};

export default PatentChart;
