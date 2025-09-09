import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyPayslips() {
	const [items, setItems] = useState<any>({ data: [] });
	useEffect(() => {
		api<any>('/me/payslips').then(setItems);
	}, []);
	return (
		<div className="w-full">
			<h3 className="text-lg font-semibold mb-2">My Payslips</h3>
			<table className="table-auto w-full text-sm">
				<thead>
					<tr>
						<th>Period Start</th>
						<th>Gross</th>
						<th>Allowances</th>
						<th>Deductions</th>
						<th>Tax</th>
						<th>Net</th>
					</tr>
				</thead>
				<tbody>
					{(items.data || []).map((it: any) => (
						<tr key={it.id}>
							<td>{it.run?.period_start}</td>
							<td>{it.gross_pay}</td>
							<td>{it.allowances_total}</td>
							<td>{it.deductions_total}</td>
							<td>{it.tax}</td>
							<td>{it.net_pay}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}