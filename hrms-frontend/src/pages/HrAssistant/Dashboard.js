// src/pages/HrAssistant/Dashboard.js
import React from 'react';
import RevenueChart from '../../components/HrAssistant/Dashboard/RevenueChart';
import EmployeeTrendChart from '../../components/HrAssistant/Dashboard/EmployeeTrendChart';
import CalendarWidget from '../../components/HrAssistant/Dashboard/CalendarWidget';
import AbsentCard from '../../components/HrAssistant/Dashboard/AbsentCard';
import TotalEmployeeCard from '../../components/HrAssistant/Dashboard/TotalEmployeeCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Revenue Report</h3>
        <RevenueChart />
      </div>

      <div className="dashboard-card calendar-card">
        <h3>Calendar</h3>
        <CalendarWidget />
      </div>

      <div className="dashboard-card absent-card">
        <AbsentCard />
      </div>

      <div className="dashboard-card total-employee-card">
        <TotalEmployeeCard />
        <EmployeeTrendChart />
      </div>
    </div>
  );
};

export default Dashboard;
