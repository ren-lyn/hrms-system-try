import { useState } from 'react';
import { api } from '../../services/api';

export function OnboardingScheduler() {
	const [employee_id, setEmployeeId] = useState('');
	const [title, setTitle] = useState('Orientation');
	const [scheduled_at, setScheduledAt] = useState('');
	const [location, setLocation] = useState('');
	const [msg, setMsg] = useState('');
	const [report, setReport] = useState<any|null>(null);

	async function schedule(e:any) {
		e.preventDefault();
		await api('/onboarding/sessions', 'POST', { employee_id, title, scheduled_at, location });
		setMsg('Session scheduled');
	}
	async function loadReport() {
		const r = await api<any>(`/onboarding/checklist-report?employee_id=${employee_id}`);
		setReport(r);
	}
	return (
		<div className="space-y-3">
			<form onSubmit={schedule} className="grid grid-cols-1 md:grid-cols-5 gap-2">
				<input className="border p-2" placeholder="Employee ID" value={employee_id} onChange={e=>setEmployeeId(e.target.value)} />
				<input className="border p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
				<input type="datetime-local" className="border p-2" value={scheduled_at} onChange={e=>setScheduledAt(e.target.value)} />
				<input className="border p-2" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
				<button className="px-4 py-2 bg-blue-600 text-white rounded">Schedule</button>
			</form>
			{msg && <div className="text-green-600">{msg}</div>}
			<div className="space-x-2">
				<button onClick={loadReport} className="px-3 py-1 bg-gray-700 text-white rounded">Checklist Report</button>
			</div>
			{report && <div className="text-sm text-gray-700">Completed {report.completed} of {report.total} tasks</div>}
		</div>
	);
}