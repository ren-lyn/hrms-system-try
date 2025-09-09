import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function PayrollSummaryChart({ from, to }: { from: string; to: string }) {
	const [series, setSeries] = useState<any[]>([]);
	useEffect(() => {
		api<any>(`/payroll/summary?from=${from}&to=${to}`).then(res => setSeries(res.series || []));
	}, [from, to]);
	return (
		<div className="w-full">
			<table className="table-auto w-full text-sm">
				<thead>
					<tr><th>Date</th><th>Gross</th><th>Net</th><th>Tax</th><th>Deductions</th></tr>
				</thead>
				<tbody>
					{series.map((r, i) => (
						<tr key={i}><td>{r.date}</td><td>{r.gross}</td><td>{r.net}</td><td>{r.tax}</td><td>{r.deductions}</td></tr>
					))}
				</tbody>
			</table>
		</div>
	);
}