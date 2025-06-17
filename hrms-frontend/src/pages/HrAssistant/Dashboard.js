// src/pages/HrAssistant/Dashboard.jsx
import React from 'react';
import ThingsToDoCard from '../../components/HrAssistant/Dashboard/ThingsToDoCard';
import EmployeeStats from '../../components/HrAssistant/Dashboard/EmployeeStats';
import AbsencesList from '../../components/HrAssistant/Dashboard/AbsencesList';
import SalesChart from '../../components/HrAssistant/Dashboard/SalesChart';
import CalendarWidget from '../../components/HrAssistant/Dashboard/CalendarWidget';

const Dashboard = () => {
  return (
    <>
      <h3 className="fw-bold mb-4">Dashboard</h3>

      <div className="row">
        <div className="col-md-4 mb-4">
          <ThingsToDoCard />
        </div>

        <div className="col-md-4 mb-4">
          <CalendarWidget />
          <EmployeeStats />
        </div>

        <div className="col-md-4 mb-4">
          <AbsencesList />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <SalesChart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
