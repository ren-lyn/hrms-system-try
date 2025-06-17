// src/components/HrAssistant/Dashboard/CalendarWidget.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const CalendarWidget = () => {
  return (
    <Card className="w-full mb-4">
      <Card.Body className="p-4">
        <h4 className="font-semibold text-lg mb-2">15 February 2025</h4>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {[...'SMTWTFS'].map((day, i) => <div key={i}>{day}</div>)}
          {[...Array(29).keys()].map(i => (
            <div key={i} className="py-1 rounded bg-gray-100">{i + 1}</div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CalendarWidget;