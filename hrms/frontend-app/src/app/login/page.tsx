"use client";
import { useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string|undefined>();

  async function login() {
    setError(undefined);
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      setError('Login failed');
      return;
    }
    const data = await res.json();
    localStorage.setItem('access', data.access);
  }

  return (
    <main className="p-6 max-w-sm">
      <h1 className="text-2xl font-semibold mb-4">HR Login</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full border rounded px-3 py-2 mb-2" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2 mb-2" />
      <button onClick={login} className="px-3 py-2 border rounded">Login</button>
    </main>
  );
}

