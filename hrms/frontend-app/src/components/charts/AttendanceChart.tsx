"use client";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useAttendanceSummary } from '@/hooks/useReports';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AttendanceChart({ from, to }: { from?: string; to?: string }) {
  const { data, isLoading } = useAttendanceSummary(from, to);
  if (isLoading) return <div>Loading attendance...</div>;
  const series = data?.series || [];
  const labels = series.map((s) => s.day);
  const chartData = {
    labels,
    datasets: [
      { label: 'Total', data: series.map(s => s.count), borderColor: '#2563eb' },
      { label: 'Late', data: series.map(s => s.late), borderColor: '#dc2626' }
    ]
  };
  return <Line data={chartData} />;
}

