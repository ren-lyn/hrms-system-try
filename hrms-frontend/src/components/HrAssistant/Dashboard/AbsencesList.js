// src/components/HrAssistant/Dashboard/AbsencesList.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const absentees = [
  { name: 'Barroga, Crystal Anne A.', status: 'On Leave' },
  { name: 'Cabrera, Donna Mae N.', status: 'On Leave' },
  { name: 'Concina, Rendyl S.', status: 'Sick Leave' },
  { name: 'Odis, Shariel D.', status: 'Vacation Leave' },
];

const AbsencesList = () => {
  return (
    <Card className="w-full">
      <Card.Body className="p-4">
        <h4 className="font-semibold text-lg mb-2">Absent</h4>
        <p className="text-sm text-gray-500 mb-3">Updated 12:09PM / 02-15-2025</p>
        <ul className="space-y-2">
          {absentees.map((emp, i) => (
            <li key={i} className="flex justify-between">
              <span>{emp.name}</span>
              <span className="text-xs text-gray-600">{emp.status}</span>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default AbsencesList;