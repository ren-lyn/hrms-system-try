// src/components/HrAssistant/Dashboard/TotalEmployeeCard.js
import React from 'react';
import { FaUsers, FaArrowUp } from 'react-icons/fa';

const TotalEmployeeCard = () => {
  return (
    <>
      <div className="employee-header">
        <div className="icon-ring">
          <FaUsers />
        </div>
        <div className="header-text">
          <span>Total Employees</span>
          <small>As of Today</small>
        </div>
      </div>

      <div className="employee-count">
        <span className="count-number">120</span>
        <span className="employee-trend up" title="Compared to last month">
          <FaArrowUp /> +5%
        </span>
      </div>

      <div className="employee-breakdown">
        <div className="breakdown-item">
          <span className="label">Full-Time:</span>
          <span className="value">95</span>
        </div>
        <div className="breakdown-item">
          <span className="label">Training:</span>
          <span className="value">25</span>
        </div>
      </div>
    </>
  );
};

export default TotalEmployeeCard;
