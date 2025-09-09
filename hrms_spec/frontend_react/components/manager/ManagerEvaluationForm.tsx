import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type CriteriaGroups = Record<string, { id: number; name: string }[]>;

export function ManagerEvaluationForm({ employeeId, periodStart, periodEnd }:{ employeeId: number; periodStart: string; periodEnd: string }) {
	const [criteria, setCriteria] = useState<CriteriaGroups>({});
	const [scores, setScores] = useState<Record<number, number>>({});
	const [comments, setComments] = useState<Record<number, string>>({});
	const [message, setMessage] = useState('');

	useEffect(() => { api<CriteriaGroups>('/performance/criteria').then(setCriteria); }, []);

	function updateScore(id:number, val:number) { setScores(s => ({ ...s, [id]: val })); }
	function updateComment(id:number, val:string) { setComments(s => ({ ...s, [id]: val })); }

	async function submit(e:any) {
		e.preventDefault();
		const items = Object.entries(scores).map(([cid, score]) => ({
			category: Object.entries(criteria).find(([, arr]) => arr.some(a => a.id === Number(cid)))?.[0] || 'General',
			question: Object.values(criteria).flat().find(a => a.id === Number(cid))?.name || '',
			score: Number(score),
			comment: comments[Number(cid)] || ''
		}));
		const totalScore = items.reduce((sum, it) => sum + (Number(it.score) || 0), 0);
		await api('/performance/reviews', 'POST', {
			employee_id: employeeId,
			period_start: periodStart,
			period_end: periodEnd,
			total_score: totalScore,
			pass_threshold: 42,
			items,
		});
		setMessage('Evaluation submitted');
	}

	return (
		<form onSubmit={submit} className="space-y-4">
			{Object.entries(criteria).map(([cat, list]) => (
				<div key={cat} className="border p-3 rounded">
					<h4 className="font-semibold mb-2">{cat}</h4>
					<div className="space-y-2">
						{list.map(c => (
							<div key={c.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
								<div className="md:col-span-3">{c.name}</div>
								<input type="number" min={1} max={10} className="border p-2" value={scores[c.id] || ''} onChange={e=>updateScore(c.id, Number(e.target.value))} />
								<input className="border p-2 md:col-span-2" placeholder="Comment" value={comments[c.id] || ''} onChange={e=>updateComment(c.id, e.target.value)} />
							</div>
						))}
					</div>
				</div>
			))}
			<button className="px-4 py-2 bg-blue-600 text-white rounded">Submit Evaluation</button>
			{message && <div className="text-green-600">{message}</div>}
		</form>
	);
}