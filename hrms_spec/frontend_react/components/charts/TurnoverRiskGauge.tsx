import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function TurnoverRiskGauge({ asOf, deptId }: { asOf: string; deptId?: number }) {
	const [avg, setAvg] = useState(0);
	useEffect(() => {
		const q = new URLSearchParams({ asOf, ...(deptId ? { deptId: String(deptId) } : {}) });
		api<any>(`/analytics/turnover-risk?${q.toString()}`).then(res => setAvg(res.avgRisk || 0));
	}, [asOf, deptId]);
	return (
		<div className="p-4 border rounded">
			<div className="text-sm text-gray-600">Average Turnover Risk</div>
			<div className="text-3xl font-semibold">{Math.round(avg * 100)}%</div>
		</div>
	);
}