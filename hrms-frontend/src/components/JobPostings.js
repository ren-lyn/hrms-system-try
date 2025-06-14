import React, { useEffect, useState } from 'react';
import axios from '../axios'; // Make sure ../axios.js exists

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', requirements: '', status: 'Open' });
  const [editingId, setEditingId] = useState(null);

  const fetchJobs = async () => {
    const response = await axios.get('/job-postings');
    setJobs(response.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`/job-postings/${editingId}`, form);
    } else {
      await axios.post('/job-postings', form);
    }

    setForm({ title: '', description: '', requirements: '', status: 'Open' });
    setEditingId(null);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditingId(job.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await axios.delete(`/job-postings/${id}`);
      fetchJobs();
    }
  };

  return (
    <div>
      <h2>Job Postings</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        /><br />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        /><br />
        <textarea
          placeholder="Requirements"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          required
        /><br />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select><br />
        <button type="submit">{editingId ? 'Update' : 'Add'} Job</button>
      </form>

      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <strong>{job.title}</strong> — {job.status}
            <br />
            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPostings;
