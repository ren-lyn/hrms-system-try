import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyAttendance() {
	const [rows, setRows] = useState<any>({ data: [] });
	const [loading, setLoading] = useState(false);
	async function load() {
		const res = await api<any>('/me/attendance');
		setRows(res);
	}
	useEffect(() => { load(); }, []);
	async function clock() {
		setLoading(true);
		try { await api('/me/attendance/clock', 'POST'); await load(); } finally { setLoading(false); }
	}
	return (
		<div className="space-y-3">
			<button onClick={clock} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Clocking...' : 'Clock In / Out'}</button>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Date</th><th>Time In</th><th>Time Out</th><th>Status</th></tr></thead>
				<tbody>
					{(rows.data || []).map((r:any) => (
						<tr key={r.id}><td>{r.date}</td><td>{r.time_in}</td><td>{r.time_out}</td><td>{r.status}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}