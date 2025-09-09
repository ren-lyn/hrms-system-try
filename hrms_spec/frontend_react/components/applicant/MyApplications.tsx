import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyApplications() {
	const [rows, setRows] = useState<any>({ data: [] });
	const [docUrl, setDocUrl] = useState('');
	const [docType, setDocType] = useState('resume');
	useEffect(() => { api<any>('/me/applications').then(setRows); }, []);
	async function upload(appId:number) {
		await api(`/recruitment/applications/${appId}/documents`, 'POST', { storage_url: docUrl, doc_type: docType });
		setRows(await api<any>('/me/applications'));
	}
	return (
		<div className="space-y-3">
			<h3 className="text-lg font-semibold">My Applications</h3>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Job</th><th>Status</th><th>Interview</th><th>Upload Doc</th></tr></thead>
				<tbody>
					{(rows.data || []).map((a:any) => (
						<tr key={a.id}>
							<td>{a.job?.title}</td>
							<td>{a.status}</td>
							<td>{a.interview_date}</td>
							<td>
								<div className="flex gap-2">
									<select className="border p-1" value={docType} onChange={e=>setDocType(e.target.value)}>
										<option value="resume">Resume</option>
										<option value="id">ID</option>
										<option value="other">Other</option>
									</select>
									<input className="border p-1" placeholder="Document URL" value={docUrl} onChange={e=>setDocUrl(e.target.value)} />
									<button onClick={()=>upload(a.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}