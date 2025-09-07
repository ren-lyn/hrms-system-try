"use client";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useLeaveSummary } from '@/hooks/useReports';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function LeaveChart() {
  const { data, isLoading } = useLeaveSummary();
  if (isLoading) return <div>Loading leave...</div>;
  const series = data?.series || [];
  const months = Array.from(new Set(series.map(s => s.month)));
  const types = Array.from(new Set(series.map(s => s.leave_type__name)));
  const datasets = types.map((type, idx) => ({
    label: type,
    data: months.map(m => series.filter(s => s.month === m && s.leave_type__name === type).reduce((a, b) => a + b.count, 0)),
    backgroundColor: `hsl(${(idx * 80) % 360} 70% 50%)`
  }));
  return <Bar data={{ labels: months, datasets }} />;
}

