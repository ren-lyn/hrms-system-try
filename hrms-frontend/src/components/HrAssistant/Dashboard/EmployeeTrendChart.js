// src/components/HrAssistant/Dashboard/EmployeeTrendChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const EmployeeTrendChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [100, 105, 108, 110, 114, 120],
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Line data={data} options={options} />;
};

export default EmployeeTrendChart;
