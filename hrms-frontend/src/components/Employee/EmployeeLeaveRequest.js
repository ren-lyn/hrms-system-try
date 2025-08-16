import React, { useState } from 'react';
import axios from 'axios';

const EmployeeLeaveRequest = () => {
  const [form, setForm] = useState({ type: '', from: '', to: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('/api/leave-requests', form);
      setMessage('✅ Leave request sent successfully!');
      setForm({ type: '', from: '', to: '' });
    } catch (err) {
      console.error(err);
      setError('❌ Failed to send leave request.');
    }
  };

  return (
    <div>
      <h2>File Leave Request</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Leave Type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.from}
          onChange={e => setForm({ ...form, from: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.to}
          onChange={e => setForm({ ...form, to: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EmployeeLeaveRequest;
