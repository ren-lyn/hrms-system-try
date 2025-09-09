"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function HrLeavePage() {
  const [requests, setRequests] = useState<any[]>([]);
  async function load() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/leave/requests/admin`, { headers: { 'Authorization': `Bearer ${access}` } });
    if (res.ok) setRequests(await res.json());
  }
  useEffect(()=>{ load(); }, []);

  async function approve(id: number) {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/leave/requests/${id}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${access}` } });
    load();
  }
  async function reject(id: number) {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/leave/requests/${id}/reject`, { method: 'POST', headers: { 'Authorization': `Bearer ${access}` } });
    load();
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">HR - Leave Approvals</h1>
      <div className="space-y-3">
        {requests.map(r => (
          <div key={r.id} className="border rounded p-4">
            <div className="font-medium">Employee #{r.employee}</div>
            <div className="text-xs opacity-70">{r.date_from} to {r.date_to} - {r.status}</div>
            <div className="space-x-2 mt-2">
              <button onClick={()=>approve(r.id)} className="px-2 py-1 border rounded">Approve</button>
              <button onClick={()=>reject(r.id)} className="px-2 py-1 border rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

