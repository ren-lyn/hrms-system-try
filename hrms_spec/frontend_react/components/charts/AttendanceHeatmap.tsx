import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function AttendanceHeatmap({ from, to, deptId }: { from: string; to: string; deptId?: number }) {
	const [heatmap, setHeatmap] = useState<any[]>([]);
	useEffect(() => {
		const q = new URLSearchParams({ from, to, ...(deptId ? { deptId: String(deptId) } : {}) });
		api<any>(`/attendance/workdays?${q.toString()}`).then(res => setHeatmap(res.heatmap || []));
	}, [from, to, deptId]);
	return (
		<div className="w-full">
			<table className="table-auto w-full text-sm">
				<thead>
					<tr><th>Date</th><th>Present</th><th>Absent</th></tr>
				</thead>
				<tbody>
					{heatmap.map((r: any, i: number) => (
						<tr key={i}><td>{r.date}</td><td>{r.present}</td><td>{r.absent}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}