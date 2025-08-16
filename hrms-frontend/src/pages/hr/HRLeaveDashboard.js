import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HRLeaveDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/hr/leave-requests');
      setLeaveRequests(response.data.data); // adjust if your API returns differently
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  return (
    <div className="container mt-4">
      <table className="table table-bordered mt-3">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.employee?.name || 'N/A'}</td>
                <td>{leave.leave_type}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.status}</td>
                <td>
                  {/* Replace with actual action buttons if needed */}
                  <button className="btn btn-success btn-sm me-2">Approve</button>
                  <button className="btn btn-danger btn-sm">Reject</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No leave requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HRLeaveDashboard;
