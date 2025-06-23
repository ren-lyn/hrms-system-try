// src/components/HrAssistant/Dashboard/HeaderBar.js
import React from 'react';
import { FaEnvelope, FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import profileImg from './profile.png';

const HeaderBar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  let pageTitle = 'Dashboard';

  if (pathname.includes('employee-records')) pageTitle = 'Employee Records';
  else if (pathname.includes('payroll')) pageTitle = 'Payroll';
  else if (pathname.includes('attendance')) pageTitle = 'Attendance';
  else if (pathname.includes('leave')) pageTitle = 'Leave Management';
  else if (pathname.includes('evaluation')) pageTitle = 'Employee Evaluation';
  else if (pathname.includes('disciplinary')) pageTitle = 'Disciplinary Action';
  else if (pathname.includes('recruitment')) pageTitle = 'Recruitment';
  else if (pathname.includes('reports')) pageTitle = 'Report Generation';

  return (
    <div className="header-bar">
      <div className="header-left">
        <h2>{pageTitle}</h2>
      </div>
      <div className="header-right">
        <FaEnvelope />
        <FaBell />
        <div className="profile-tab">
          <img src={profileImg} alt="User Profile" />
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
