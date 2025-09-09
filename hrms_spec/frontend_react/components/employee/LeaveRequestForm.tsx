import { useState } from 'react';
import { api } from '../../services/api';

export function LeaveRequestForm() {
	const [type, setType] = useState('vacation');
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');
	const [reason, setReason] = useState('');
	const [status, setStatus] = useState<'idle'|'ok'|'err'>('idle');

	async function submit(e:any) {
		e.preventDefault();
		try {
			await api('/leaves/requests', 'POST', { type, start_date: start, end_date: end, reason });
			setStatus('ok');
		} catch (e) {
			setStatus('err');
		}
	}

	return (
		<form onSubmit={submit} className="space-y-3">
			<div>
				<label className="block text-sm">Type</label>
				<select className="border p-2 w-full" value={type} onChange={e=>setType(e.target.value)}>
					<option value="vacation">Vacation</option>
					<option value="sick">Sick</option>
				</select>
			</div>
			<div>
				<label className="block text-sm">Start date</label>
				<input type="date" className="border p-2 w-full" value={start} onChange={e=>setStart(e.target.value)} />
			</div>
			<div>
				<label className="block text-sm">End date</label>
				<input type="date" className="border p-2 w-full" value={end} onChange={e=>setEnd(e.target.value)} />
			</div>
			<div>
				<label className="block text-sm">Reason</label>
				<input className="border p-2 w-full" value={reason} onChange={e=>setReason(e.target.value)} />
			</div>
			<button className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
			{status==='ok' && <div className="text-green-600">Submitted.</div>}
			{status==='err' && <div className="text-red-600">Error submitting.</div>}
		</form>
	);
}