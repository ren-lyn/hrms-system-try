import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function ApplicantJobBoard() {
	const [rows, setRows] = useState<any>({ data: [] });
	useEffect(() => { api<any>('/recruitment/job-posts?status=open').then(setRows); }, []);
	async function apply(jobId:number) {
		await api('/recruitment/applications', 'POST', { job_id: jobId });
		alert('Applied');
	}
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Open Positions</h3>
			<ul className="space-y-2">
				{(rows.data || []).map((j:any) => (
					<li key={j.id} className="border p-3 rounded flex items-center justify-between">
						<div>
							<div className="font-semibold">{j.title}</div>
							<div className="text-sm text-gray-600">{j.description}</div>
						</div>
						<button onClick={()=>apply(j.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Apply</button>
					</li>
				))}
			</ul>
		</div>
	);
}