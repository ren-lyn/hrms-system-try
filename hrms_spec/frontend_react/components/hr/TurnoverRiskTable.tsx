import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function TurnoverRiskTable({ asOf, min=0.3 }:{ asOf: string; min?: number }) {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>(`/analytics/turnover-risk/list?asOf=${asOf}&min=${min}`).then(setRows); }, [asOf, min]);
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">High-Risk Employees</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Employee</th><th>Probability</th></tr></thead>
				<tbody>
					{(rows.data || []).map((r:any) => (
						<tr key={r.id}><td>{r.employee?.user?.name || r.employee_id}</td><td>{(r.probability*100).toFixed(0)}%</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}