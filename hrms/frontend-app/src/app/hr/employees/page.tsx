"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

type Emp = { id: number; employee_code: string; nickname?: string; employment_status: string };

export default function HrEmployeesPage() {
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Emp | null>(null);
  const [nickname, setNickname] = useState('');

  function authHeaders() {
    const access = localStorage.getItem('access');
    return { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' };
  }

  async function load() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/employees?q=${encodeURIComponent(q)}`, { headers: { 'Authorization': `Bearer ${access}` } });
    if (res.ok) setEmployees(await res.json());
  }
  useEffect(()=>{ load(); }, []);

  async function updateNickname(e: Emp) {
    await fetch(`${API_BASE}/api/employees/${e.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ ...e, nickname }) });
    setEditing(null);
    load();
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">HR - Employees</h1>
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="border rounded px-3 py-2" />
        <button onClick={load} className="px-3 py-2 border rounded">Search</button>
      </div>
      <div className="space-y-2">
        {employees.map(e => (
          <div key={e.id} className="border rounded p-3 flex items-center justify-between">
            <div>#{e.employee_code} [{e.employment_status}]</div>
            <div className="space-x-2">
              <button onClick={()=>{ setEditing(e); setNickname(e.nickname||''); }} className="px-2 py-1 border rounded">Edit Nickname</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="border rounded p-4 space-y-2">
          <div className="font-medium">Edit {editing.employee_code}</div>
          <input value={nickname} onChange={e=>setNickname(e.target.value)} className="border rounded px-3 py-2" />
          <button onClick={()=>updateNickname(editing)} className="px-3 py-2 border rounded">Save</button>
          <button onClick={()=>setEditing(null)} className="px-3 py-2 border rounded">Cancel</button>
        </div>
      )}
    </main>
  );
}

