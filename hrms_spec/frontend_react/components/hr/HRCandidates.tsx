import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function HRCandidates() {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>('/recruitment/applications').then(setRows); }, []);
	async function update(id:number, status:string, interview_date?:string) {
		await api(`/recruitment/applications/${id}/status`, 'PATCH', { status, interview_date });
		setRows(await api<any>('/recruitment/applications'));
	}
	async function hire(id:number) {
		await api(`/recruitment/applications/${id}/hire`, 'POST');
		setRows(await api<any>('/recruitment/applications'));
	}
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Candidates</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Job</th><th>Status</th><th>Interview</th><th>Actions</th></tr></thead>
				<tbody>
					{(rows.data || []).map((a:any) => (
						<tr key={a.id}>
							<td>{a.job?.title}</td>
							<td>{a.status}</td>
							<td>{a.interview_date || '-'}</td>
							<td className="space-x-2">
								<button onClick={()=>update(a.id, 'shortlisted')} className="px-2 py-1 bg-amber-600 text-white rounded">Shortlist</button>
								<button onClick={()=>update(a.id, 'interview', new Date().toISOString())} className="px-2 py-1 bg-blue-600 text-white rounded">Interview</button>
								<button onClick={()=>update(a.id, 'offer_pending')} className="px-2 py-1 bg-violet-600 text-white rounded">Offer</button>
								<button onClick={()=>hire(a.id)} className="px-2 py-1 bg-green-600 text-white rounded">Hire</button>
								<button onClick={()=>update(a.id, 'rejected')} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}