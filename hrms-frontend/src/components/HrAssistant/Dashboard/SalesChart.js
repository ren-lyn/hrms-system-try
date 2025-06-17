// src/components/HrAssistant/Dashboard/SalesChart.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 45.87 },
  { month: 'Feb', value: 75.9 },
  { month: 'Mar', value: 25.59 },
  { month: 'Apr', value: 45.87 },
];

const SalesChart = () => {
  return (
    <Card className="w-full">
      <Card.Body className="p-4">
        <h4 className="font-semibold text-lg mb-4">Sales</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default SalesChart;
