import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [20, 10, 4, 2],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
      },
    ],
  });

  const updateChartData = () => {
    setChartData({
      labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
      datasets: [
        {
          label: 'Updated Dataset',
          data: [10, 20, 30, 40],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
        },
      ],
    });
  };

  return (
    <div>
      <Radar data={chartData} />
      <button onClick={updateChartData}>Update Chart</button>
    </div>
  );
};

export default RadarChart;