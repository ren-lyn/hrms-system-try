import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyGoals() {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>('/performance/goals').then(setRows); }, []);
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">My Goals</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Title</th><th>Due</th><th>Status</th><th>Score</th></tr></thead>
				<tbody>
					{(rows.data || []).map((g:any) => (
						<tr key={g.id}><td>{g.title}</td><td>{g.due_date}</td><td>{g.status}</td><td>{g.score}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}