export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

function getAuthHeader() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api<T>(path: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeader(),
		},
		credentials: 'include',
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
	}
	return res.json();
}