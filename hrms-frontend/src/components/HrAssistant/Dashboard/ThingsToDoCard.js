// src/components/HrAssistant/Dashboard/ThingsToDoCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { ClipboardCheck, FileText, UserCog } from 'lucide-react';

const tasks = [
  { icon: <ClipboardCheck className="mr-2" />, label: 'Review Attendance Logs' },
  { icon: <FileText className="mr-2" />, label: 'Approve Leave Requests' },
  { icon: <UserCog className="mr-2" />, label: 'Update Employee Records' }
];

const ThingsToDoCard = () => {
  return (
    <Card className="w-full mb-4">
      <Card.Body className="p-4">
        <h4 className="font-semibold text-lg mb-2">Things to do</h4>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center p-2 bg-gray-100 rounded hover:bg-gray-200">
              {task.icon}
              <span>{task.label}</span>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default ThingsToDoCard;