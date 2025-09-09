import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function HREvaluationApprovals() {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>('/performance/reviews').then(setRows); }, []);
	async function approve(id:number) {
		await api(`/performance/reviews/${id}/approve`, 'POST');
		setRows(await api<any>('/performance/reviews'));
	}
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Pending Evaluations</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Employee</th><th>Period</th><th>Score</th><th>Status</th><th></th></tr></thead>
				<tbody>
					{(rows.data || []).map((e:any) => (
						<tr key={e.id}>
							<td>{e.employee_id}</td>
							<td>{e.period_start} - {e.period_end}</td>
							<td>{e.total_score}</td>
							<td>{e.status}</td>
							<td>{e.status !== 'approved' && <button onClick={()=>approve(e.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}