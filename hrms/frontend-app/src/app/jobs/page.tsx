import Link from 'next/link';
import { API_BASE } from '@/lib/api';

async function fetchJobs(search?: string) {
  const params = new URLSearchParams();
  params.set('published', 'true');
  if (search) params.set('search', search);
  const res = await fetch(`${API_BASE}/api/recruitment/jobs?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function JobsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q || '';
  const jobs = await fetchJobs(q);
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Open Positions</h1>
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search jobs" className="border rounded px-3 py-2" />
        <button className="ml-2 px-3 py-2 border rounded">Search</button>
      </form>
      <div className="space-y-3">
        {jobs.map((job: any) => (
          <div key={job.id} className="border rounded p-4">
            <h2 className="font-medium">{job.title}</h2>
            <p className="text-sm opacity-80">{job.description}</p>
            <div className="mt-2">
              <Link href={`/jobs/${job.id}/apply`} className="px-3 py-2 border rounded inline-block">Apply Now</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}