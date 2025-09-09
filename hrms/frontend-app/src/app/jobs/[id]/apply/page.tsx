"use client";
import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ApplyPage({ params }: { params: { id: string } }) {
  const jobId = params.id;
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [cover, setCover] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!resume) { setError('Resume required'); return; }
    setSubmitting(true);
    setError(null);
    const form = new FormData();
    form.set('job', jobId);
    form.set('full_name', fullName);
    form.set('email', email);
    form.set('phone', phone);
    form.set('resume', resume);
    form.set('cover_letter', cover);
    const res = await fetch(`${API_BASE}/api/recruitment/applications`, { method: 'POST', body: form });
    setSubmitting(false);
    if (res.ok) {
      router.push('/jobs');
    } else {
      const data = await res.text();
      setError(data || 'Submission failed');
    }
  }

  return (
    <main className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Apply for Job</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="w-full border rounded px-3 py-2" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full border rounded px-3 py-2" />
      <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder="Cover Letter" className="w-full border rounded px-3 py-2" />
      <input type="file" onChange={e=>setResume(e.target.files?.[0]||null)} />
      <button disabled={submitting} onClick={submit} className="px-3 py-2 border rounded">{submitting?'Submitting...':'Submit Application'}</button>
    </main>
  );
}