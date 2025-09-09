"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function HrApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  async function load() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/recruitment/applications/admin`, { headers: { 'Authorization': `Bearer ${access}` } });
    if (res.ok) setApps(await res.json());
  }
  useEffect(()=>{ load(); }, []);

  async function updateStatus(id: number, status: string) {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/recruitment/applications/${id}/status`, { method: 'POST', headers: { 'Content-Type':'application/json','Authorization': `Bearer ${access}` }, body: JSON.stringify({ status }) });
    load();
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">HR - Applications</h1>
      <div className="space-y-3">
        {apps.map(app => (
          <div key={app.id} className="border rounded p-4">
            <div className="font-medium">{app.full_name} - {app.email}</div>
            <div className="text-xs opacity-70">Status: {app.status}</div>
            <div className="space-x-2 mt-2">
              <button onClick={()=>updateStatus(app.id, 'SHORTLISTED')} className="px-2 py-1 border rounded">Shortlist</button>
              <button onClick={()=>updateStatus(app.id, 'REJECTED')} className="px-2 py-1 border rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

