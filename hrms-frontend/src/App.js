import axios from 'axios';
import { useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RegisterApplicant from './pages/RegisterApplicant';
import 'bootstrap/dist/css/bootstrap.min.css';

import HrAssistantDashboard from './pages/HrAssistant/Dashboard';
import HrStaffDashboard from './pages/HrStaffDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ApplicantDashboard from './pages/ApplicantDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import HrAssistantLayout from './pages/HrAssistant/HrAssistantLayout';
import EmployeeRecords from './pages/HrAssistant/EmployeeRecords';

import HRLeaveDashboard from './pages/hr/HRLeaveDashboard'; // ✅ HR Assistant leave view
import EmployeeLeaveRequest from './components/Employee/EmployeeLeaveRequest'; // ✅ Employee leave form

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterApplicant />} />
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />

        {/* HR Assistant Dashboard + Sidebar Layout */}
        <Route
          path="/dashboard/hr-assistant"
          element={
            <ProtectedRoute role="HR Assistant">
              <HrAssistantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HrAssistantDashboard />} />
          <Route path="employee-records" element={<EmployeeRecords />} />
          <Route path="leave" element={<HRLeaveDashboard />} />
        </Route>

        {/* HR Staff */}
        <Route
          path="/dashboard/hr-staff"
          element={
            <ProtectedRoute role="HR Staff">
              <HrStaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute role="Manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Applicant */}
        <Route
          path="/dashboard/applicant"
          element={
            <ProtectedRoute role="Applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Employee with nested routes (so sidebar layout is preserved) */}
        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute role="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Welcome Employee</div>} />
          <Route path="leave-request" element={<EmployeeLeaveRequest />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
