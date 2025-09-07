"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { usePayrollSummary } from '@/hooks/useReports';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PayrollChart({ cycleId }: { cycleId?: string }) {
  const { data, isLoading } = usePayrollSummary(cycleId);
  if (isLoading) return <div>Loading payroll...</div>;
  const gross = data?.total_gross || 0;
  const net = data?.total_net || 0;
  const tax = Math.max(gross - net, 0);
  const chartData = {
    labels: ['Net', 'Tax + Deductions'],
    datasets: [{ data: [net, tax], backgroundColor: ['#16a34a', '#f59e0b'] }]
  };
  return <Doughnut data={chartData} />;
}

