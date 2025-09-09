import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function JobPostManager() {
	const [rows, setRows] = useState<any>({ data: [] });
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [requirements, setReq] = useState('');
	const [q, setQ] = useState('');
	async function load() { setRows(await api<any>(`/recruitment/job-posts?q=${encodeURIComponent(q)}`)); }
	useEffect(() => { load(); }, []);
	async function create(e:any) {
		e.preventDefault();
		await api('/recruitment/job-posts', 'POST', { title, description, requirements });
		setTitle(''); setDescription(''); setReq('');
		await load();
	}
	async function publish(id:number) { await api(`/recruitment/job-posts/${id}/publish`, 'PATCH'); await load(); }
	async function close(id:number) { await api(`/recruitment/job-posts/${id}/close`, 'PATCH'); await load(); }
	async function update(id:number, status:string) { await api(`/recruitment/job-posts/${id}`, 'PATCH', { status }); await load(); }
	async function remove(id:number) { await api(`/recruitment/job-posts/${id}`, 'DELETE'); await load(); }
	return (
		<div className="space-y-3">
			<form onSubmit={create} className="space-y-2">
				<input className="border p-2 w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
				<textarea className="border p-2 w-full" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
				<textarea className="border p-2 w-full" placeholder="Requirements" value={requirements} onChange={e=>setReq(e.target.value)} />
				<button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
			</form>
			<div className="flex gap-2 items-center">
				<input className="border p-2" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
				<button onClick={load} className="px-3 py-1 bg-gray-700 text-white rounded">Search</button>
			</div>
			<table className="table-auto w-full text-sm">
				<thead><tr><th>Title</th><th>Status</th><th>Actions</th></tr></thead>
				<tbody>
					{(rows.data || []).map((p:any) => (
						<tr key={p.id}>
							<td>{p.title}</td>
							<td>{p.status}</td>
							<td className="space-x-2">
								<button onClick={()=>publish(p.id)} className="px-2 py-1 bg-green-600 text-white rounded">Publish</button>
								<button onClick={()=>close(p.id)} className="px-2 py-1 bg-amber-600 text-white rounded">Close</button>
								<button onClick={()=>update(p.id, 'draft')} className="px-2 py-1 bg-blue-600 text-white rounded">Edit Status</button>
								<button onClick={()=>remove(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}