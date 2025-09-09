"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

type Doc = { id: number; employee: number; name: string; status: string; remarks?: string };

export default function HrOnboardingPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [docName, setDocName] = useState('Birth Certificate');
  const [orientationEmployeeId, setOrientationEmployeeId] = useState('');
  const [orientationAt, setOrientationAt] = useState('');
  const [startEmployeeId, setStartEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [salaryEmployeeId, setSalaryEmployeeId] = useState('');
  const [salary, setSalary] = useState('');

  async function load() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/onboarding/documents/list`, { headers: { 'Authorization': `Bearer ${access}` } });
    if (res.ok) setDocs(await res.json());
  }
  useEffect(()=>{ load(); }, []);

  function authHeaders() {
    const access = localStorage.getItem('access');
    return { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' };
  }

  async function createDoc() {
    await fetch(`${API_BASE}/api/onboarding/documents`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ employee: Number(employeeId), name: docName }) });
    load();
  }
  async function approve(id: number) {
    await fetch(`${API_BASE}/api/onboarding/documents/${id}/approve`, { method: 'POST', headers: authHeaders() });
    load();
  }
  async function reject(id: number) {
    await fetch(`${API_BASE}/api/onboarding/documents/${id}/reject`, { method: 'POST', headers: authHeaders() });
    load();
  }
  async function scheduleOrientation() {
    await fetch(`${API_BASE}/api/onboarding/orientation`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ employee: Number(orientationEmployeeId), scheduled_at: orientationAt }) });
  }
  async function setStart() {
    await fetch(`${API_BASE}/api/onboarding/employees/${startEmployeeId}/start-date`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ start_date: startDate }) });
  }
  async function setBaseSalary() {
    await fetch(`${API_BASE}/api/onboarding/employees/${salaryEmployeeId}/salary`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ base_salary: salary }) });
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">HR - Onboarding</h1>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Create Document Request</h2>
        <input value={employeeId} onChange={e=>setEmployeeId(e.target.value)} placeholder="Employee ID" className="border rounded px-3 py-2" />
        <input value={docName} onChange={e=>setDocName(e.target.value)} placeholder="Document Name" className="border rounded px-3 py-2" />
        <button onClick={createDoc} className="px-3 py-2 border rounded">Create</button>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Document Requests</h2>
        {docs.map(d => (
          <div key={d.id} className="border rounded p-3 flex items-center justify-between">
            <div>Emp #{d.employee} - {d.name} [{d.status}]</div>
            <div className="space-x-2">
              <button onClick={()=>approve(d.id)} className="px-2 py-1 border rounded">Approve</button>
              <button onClick={()=>reject(d.id)} className="px-2 py-1 border rounded">Reject</button>
            </div>
          </div>
        ))}
      </section>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Schedule Orientation</h2>
        <input value={orientationEmployeeId} onChange={e=>setOrientationEmployeeId(e.target.value)} placeholder="Employee ID" className="border rounded px-3 py-2" />
        <input value={orientationAt} onChange={e=>setOrientationAt(e.target.value)} placeholder="ISO datetime" className="border rounded px-3 py-2" />
        <button onClick={scheduleOrientation} className="px-3 py-2 border rounded">Schedule</button>
      </section>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Set Starting Date</h2>
        <input value={startEmployeeId} onChange={e=>setStartEmployeeId(e.target.value)} placeholder="Employee ID" className="border rounded px-3 py-2" />
        <input value={startDate} onChange={e=>setStartDate(e.target.value)} placeholder="YYYY-MM-DD" className="border rounded px-3 py-2" />
        <button onClick={setStart} className="px-3 py-2 border rounded">Set</button>
      </section>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Set Base Salary</h2>
        <input value={salaryEmployeeId} onChange={e=>setSalaryEmployeeId(e.target.value)} placeholder="Employee ID" className="border rounded px-3 py-2" />
        <input value={salary} onChange={e=>setSalary(e.target.value)} placeholder="Amount" className="border rounded px-3 py-2" />
        <button onClick={setBaseSalary} className="px-3 py-2 border rounded">Set</button>
      </section>
    </main>
  );
}

