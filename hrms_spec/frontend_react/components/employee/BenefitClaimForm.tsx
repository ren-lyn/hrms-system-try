import { useState } from 'react';
import { api } from '../../services/api';

export function BenefitClaimForm() {
	const [type, setType] = useState('sss');
	const [reason, setReason] = useState('');
	const [document_url, setDocumentUrl] = useState('');
	const [status, setStatus] = useState('idle');

	async function submit(e:any) {
		e.preventDefault();
		setStatus('submitting');
		try {
			await api('/benefits/claims', 'POST', { type, reason, document_url });
			setStatus('success');
		} catch (e) {
			setStatus('error');
		}
	}

	return (
		<form onSubmit={submit} className="space-y-2">
			<div>
				<label className="block text-sm">Type</label>
				<select className="border p-2 w-full" value={type} onChange={e => setType(e.target.value)}>
					<option value="sss">SSS</option>
					<option value="phic">PhilHealth</option>
					<option value="pagibig">Pag-IBIG</option>
				</select>
			</div>
			<div>
				<label className="block text-sm">Reason</label>
				<input className="border p-2 w-full" value={reason} onChange={e => setReason(e.target.value)} />
			</div>
			<div>
				<label className="block text-sm">Document URL</label>
				<input className="border p-2 w-full" value={document_url} onChange={e => setDocumentUrl(e.target.value)} />
			</div>
			<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
			{status === 'success' && <div className="text-green-600">Submitted.</div>}
			{status === 'error' && <div className="text-red-600">Error submitting.</div>}
		</form>
	);
}