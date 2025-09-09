import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function MyBenefits() {
	const [data, setData] = useState<{enrollments:any[];claims:any[]}>({ enrollments: [], claims: [] });
	useEffect(() => {
		api<any>('/me/benefits').then(setData);
	}, []);
	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">My Enrollments</h3>
				<table className="table-auto w-full text-sm">
					<thead><tr><th>Type</th><th>Contribution</th><th>Status</th></tr></thead>
					<tbody>
						{data.enrollments.map((b:any) => (
							<tr key={b.id}><td>{b.type}</td><td>{b.contribution}</td><td>{b.status}</td></tr>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<h3 className="text-lg font-semibold">My Claims</h3>
				<table className="table-auto w-full text-sm">
					<thead><tr><th>Type</th><th>Status</th><th>Reason</th></tr></thead>
					<tbody>
						{data.claims.map((c:any) => (
							<tr key={c.id}><td>{c.type}</td><td>{c.status}</td><td>{c.reason}</td></tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}