// src/pages/hr/LeaveDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);

  useEffect(() => {
    axios.get(`/api/leaves/${id}`)
      .then(res => setLeave(res.data))
      .catch(err => console.error('Error:', err));
  }, [id]);

  const updateStatus = (status) => {
    axios.put(`/api/leaves/${id}`, { status })
      .then(() => navigate('/dashboard/hr-staff/leave-management'))
      .catch(err => console.error('Error updating:', err));
  };

  if (!leave) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>Leave Request Details</h2>
      <p><strong>Employee:</strong> {leave.employee?.name}</p>
      <p><strong>Type:</strong> {leave.type}</p>
      <p><strong>Start Date:</strong> {leave.start_date}</p>
      <p><strong>End Date:</strong> {leave.end_date}</p>
      <p><strong>Status:</strong> {leave.status}</p>
      <p><strong>Reason:</strong> {leave.reason}</p>

      {leave.status === 'pending' && (
        <div className="mt-3">
          <button className="btn btn-success me-2" onClick={() => updateStatus('approved')}>Approve</button>
          <button className="btn btn-danger" onClick={() => updateStatus('rejected')}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;
