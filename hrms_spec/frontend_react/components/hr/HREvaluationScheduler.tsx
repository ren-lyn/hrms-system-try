import { useState } from 'react';
import { api } from '../../services/api';

export function HREvaluationScheduler() {
	const [employee_id, setEmployeeId] = useState('');
	const [period_start, setStart] = useState('');
	const [period_end, setEnd] = useState('');
	const [scheduled_at, setScheduledAt] = useState('');
	const [msg, setMsg] = useState('');
	async function submit(e:any) {
		e.preventDefault();
		await api('/performance/schedules', 'POST', { employee_id, period_start, period_end, scheduled_at });
		setMsg('Scheduled');
	}
	return (
		<form onSubmit={submit} className="space-y-2">
			<input className="border p-2 w-full" placeholder="Employee ID" value={employee_id} onChange={e=>setEmployeeId(e.target.value)} />
			<input type="date" className="border p-2 w-full" value={period_start} onChange={e=>setStart(e.target.value)} />
			<input type="date" className="border p-2 w-full" value={period_end} onChange={e=>setEnd(e.target.value)} />
			<input type="datetime-local" className="border p-2 w-full" value={scheduled_at} onChange={e=>setScheduledAt(e.target.value)} />
			<button className="px-4 py-2 bg-blue-600 text-white rounded">Schedule</button>
			{msg && <div className="text-green-600">{msg}</div>}
		</form>
	);
}