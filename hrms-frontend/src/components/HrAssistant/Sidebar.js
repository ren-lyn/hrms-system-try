// src/components/HrAssistant/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar bg-white shadow-sm">
      <div className="p-4 border-bottom">
        <img src="/logo.png" alt="Logo" className="img-fluid mb-2" />
        <h5 className="fw-bold mb-0">CabCCDC</h5>
        <small>HRMS</small>
      </div>
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <NavLink to="dashboard" className="nav-link">📊 Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="attendance" className="nav-link">🕒 Attendance</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="payroll" className="nav-link">💵 Payroll</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="employee-records" className="nav-link">📁 Employee Records</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="evaluation" className="nav-link">📈 Evaluation</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="leave-application" className="nav-link">📤 Leave Application</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
