"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function HrJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [department, setDepartment] = useState('1');
  const [position, setPosition] = useState('1');

  async function fetchJobs() {
    const res = await fetch(`${API_BASE}/api/recruitment/jobs`);
    if (res.ok) setJobs(await res.json());
  }
  useEffect(() => { fetchJobs(); }, []);

  async function createJob() {
    const access = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/api/recruitment/jobs`, {
      method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${access}` },
      body: JSON.stringify({ title, description, requirements, department, position })
    });
    if (res.ok) fetchJobs();
  }

  async function publish(id: number) {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/recruitment/jobs/${id}/publish`, { method: 'POST', headers: { 'Authorization': `Bearer ${access}` } });
    fetchJobs();
  }
  async function unpublish(id: number) {
    const access = localStorage.getItem('access');
    await fetch(`${API_BASE}/api/recruitment/jobs/${id}/unpublish`, { method: 'POST', headers: { 'Authorization': `Bearer ${access}` } });
    fetchJobs();
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">HR - Job Postings</h1>
      <div className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Create Job Posting</h2>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full border rounded px-3 py-2" />
        <textarea value={requirements} onChange={e=>setRequirements(e.target.value)} placeholder="Requirements" className="w-full border rounded px-3 py-2" />
        <div className="flex gap-2">
          <input value={department} onChange={e=>setDepartment(e.target.value)} placeholder="Department ID" className="border rounded px-3 py-2" />
          <input value={position} onChange={e=>setPosition(e.target.value)} placeholder="Position ID" className="border rounded px-3 py-2" />
        </div>
        <button onClick={createJob} className="px-3 py-2 border rounded">Create</button>
      </div>
      <div className="space-y-3">
        {jobs.map(job => (
          <div key={job.id} className="border rounded p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{job.title}</div>
                <div className="text-xs opacity-70">Status: {job.status}</div>
              </div>
              <div className="space-x-2">
                <button onClick={()=>publish(job.id)} className="px-2 py-1 border rounded">Publish</button>
                <button onClick={()=>unpublish(job.id)} className="px-2 py-1 border rounded">Unpublish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

