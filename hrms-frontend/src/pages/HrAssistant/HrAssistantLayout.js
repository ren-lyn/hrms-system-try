// src/pages/HrAssistant/HrAssistantLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/HrAssistant/Dashboard/Sidebar';
import HeaderBar from '../../components/HrAssistant/Dashboard/Headerbar';
import './Dashboard.css';

const HrAssistantLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <section className="main-section">
          <HeaderBar />
          <Outlet /> {/* Renders child routes like Dashboard or EmployeeRecords */}
        </section>
      </div>
    </div>
  );
};

export default HrAssistantLayout;
