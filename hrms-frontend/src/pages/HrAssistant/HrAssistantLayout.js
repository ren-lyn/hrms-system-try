// src/pages/HrAssistant/HrAssistantLayout.jsx
import React from 'react';
import Sidebar from '../../components/HrAssistant/Sidebar';
import { Outlet } from 'react-router-dom';



const HrAssistantLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3 bg-light min-vh-100" style={{ marginLeft: '250px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HrAssistantLayout;
