import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyEvaluations() {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>('/me/performance').then(setRows); }, []);
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">My Evaluations</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Period</th><th>Total Score</th><th>Status</th></tr></thead>
				<tbody>
					{(rows.data || []).map((e:any) => (
						<tr key={e.id}><td>{e.period_start} - {e.period_end}</td><td>{e.total_score}</td><td>{e.status}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}