// src/components/HrAssistant/Dashboard/EmployeeStats.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const EmployeeStats = () => {
  return (
    <Card className="w-full mb-4">
      <Card.Body className="p-4">
        <h4 className="font-semibold text-lg">Total Employee</h4>
        <div className="mt-2">
          <p className="text-4xl font-bold">100 Total</p>
          <div className="mt-2">
            <p>Full time</p>
            <div className="w-full bg-gray-300 rounded h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: '75%' }}></div>
            </div>
            <p>Trainings</p>
            <div className="w-full bg-gray-300 rounded h-2">
              <div className="bg-green-500 h-2 rounded" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmployeeStats;