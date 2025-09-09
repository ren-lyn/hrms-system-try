import { useState } from 'react';

export function HRReports() {
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	function link(type:string) { return `/api/reports/csv?type=${type}&from=${from}&to=${to}`; }
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				<input type="date" className="border p-2" value={from} onChange={e=>setFrom(e.target.value)} />
				<input type="date" className="border p-2" value={to} onChange={e=>setTo(e.target.value)} />
				<a href={link('payroll')} className="px-3 py-2 bg-blue-600 text-white rounded text-center">Payroll CSV</a>
				<a href={link('attendance')} className="px-3 py-2 bg-blue-600 text-white rounded text-center">Attendance CSV</a>
				<a href={link('leave')} className="px-3 py-2 bg-blue-600 text-white rounded text-center">Leave CSV</a>
				<a href={link('performance')} className="px-3 py-2 bg-blue-600 text-white rounded text-center">Performance CSV</a>
			</div>
		</div>
	);
}