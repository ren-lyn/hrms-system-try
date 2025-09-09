"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function HrBenefitsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  async function load() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/benefits/claims/admin`, { headers: { 'Authorization': `Bearer ${access}` } });
    if (res.ok) setClaims(await res.json());
  }
  useEffect(()=>{ load(); }, []);

  async function decide(id: number, action: 'approve'|'reject') {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/benefits/claims/${id}/${action}`, { method: 'POST', headers: { 'Authorization': `Bearer ${access}` } });
    load();
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">HR - Benefit Claims</h1>
      <div className="space-y-3">
        {claims.map(c => (
          <div key={c.id} className="border rounded p-4">
            <div className="font-medium">Claim #{c.id} - {c.status}</div>
            <div className="text-xs opacity-70">{c.description}</div>
            <div className="space-x-2 mt-2">
              <button onClick={()=>decide(c.id,'approve')} className="px-2 py-1 border rounded">Approve</button>
              <button onClick={()=>decide(c.id,'reject')} className="px-2 py-1 border rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

