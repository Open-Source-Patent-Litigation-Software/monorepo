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

const PatentChart: React.FC<PatentChartProps> = ({ data }) => {
    console.log(data)
    return <Radar data={data} />;
};

export default PatentChart;
