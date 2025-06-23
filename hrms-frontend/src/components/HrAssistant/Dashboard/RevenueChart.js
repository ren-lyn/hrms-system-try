// src/components/HrAssistant/Dashboard/RevenueChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales (₱)',
      data: [12000, 15000, 10000, 17000, 14000, 20000],
      backgroundColor: '#4ea8de',
      borderRadius: 5,
      barThickness: 25,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white' },
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RevenueChart;
