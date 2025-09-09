import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyOnboarding() {
	const [data, setData] = useState<{tasks:any[];sessions:any[]}>({ tasks: [], sessions: [] });
	useEffect(() => { api<any>('/me/onboarding').then(setData); }, []);
	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">My Onboarding Tasks</h3>
				<table className="table-auto w-full text-sm">
					<thead><tr><th>Task</th><th>Status</th><th>Due</th></tr></thead>
					<tbody>
						{data.tasks.map((t:any)=> (
							<tr key={t.id}><td>{t.task}</td><td>{t.status}</td><td>{t.due_date}</td></tr>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<h3 className="text-lg font-semibold">Orientation/Training Sessions</h3>
				<table className="table-auto w-full text-sm">
					<thead><tr><th>Title</th><th>When</th><th>Location</th><th>Status</th></tr></thead>
					<tbody>
						{data.sessions.map((s:any)=> (
							<tr key={s.id}><td>{s.title}</td><td>{s.scheduled_at}</td><td>{s.location}</td><td>{s.status}</td></tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}