import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function ManagerGoals({ employeeId }:{ employeeId: number }) {
	const [rows, setRows] = useState<any>({ data: [] });
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [due_date, setDue] = useState('');
	const [weight, setWeight] = useState<number|''>('');

	async function load() {
		const r = await api<any>(`/performance/goals?employee_id=${employeeId}`);
		setRows(r);
	}
	useEffect(() => { load(); }, [employeeId]);

	async function save(e:any) {
		e.preventDefault();
		await api('/performance/goals', 'POST', { employee_id: employeeId, title, description, due_date, weight });
		setTitle(''); setDescription(''); setDue(''); setWeight('');
		await load();
	}

	return (
		<div className="space-y-3">
			<form onSubmit={save} className="grid grid-cols-1 md:grid-cols-5 gap-2">
				<input className="border p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
				<input className="border p-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
				<input type="date" className="border p-2" value={due_date} onChange={e=>setDue(e.target.value)} />
				<input type="number" className="border p-2" placeholder="Weight" value={weight} onChange={e=>setWeight(Number(e.target.value))} />
				<button className="px-4 py-2 bg-blue-600 text-white rounded">Add Goal</button>
			</form>
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