import dynamic from 'next/dynamic';

const AttendanceChart = dynamic(() => import('@/components/charts/AttendanceChart'), { ssr: false });
const LeaveChart = dynamic(() => import('@/components/charts/LeaveChart'), { ssr: false });
const PayrollChart = dynamic(() => import('@/components/charts/PayrollChart'), { ssr: false });

export default function Home() {
  const from = new Date(Date.now() - 13 * 86400000).toISOString();
  const to = new Date().toISOString();
  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">HRMS Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-4 rounded border">
          <h2 className="mb-2 font-medium">Attendance (last 14 days)</h2>
          <AttendanceChart from={from} to={to} />
        </section>
        <section className="p-4 rounded border">
          <h2 className="mb-2 font-medium">Leave by Month</h2>
          <LeaveChart />
        </section>
        <section className="p-4 rounded border">
          <h2 className="mb-2 font-medium">Payroll Gross vs Net</h2>
          <PayrollChart />
        </section>
      </div>
    </main>
  );
}
