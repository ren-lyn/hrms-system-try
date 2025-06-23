// src/components/HrAssistant/Dashboard/AbsentCard.js
import React, { useEffect, useState } from 'react';
import { FaUser, FaUserSlash } from 'react-icons/fa';

const AbsentCard = () => {
  const [updateTime, setUpdateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    setUpdateTime(`Updated ${time} / ${date}`);
  }, []);

  const absentees = [
    { name: 'Barayang, Crystal Anne A.', date: 'Feb 15', status: 'On Leave' },
    { name: 'Cabuyao, Donna Mae N.', date: 'Feb 15', status: 'On Leave' },
    { name: 'Concina, Renelyn S.', date: 'Feb 15–18', status: 'Sick Leave' },
    { name: 'Osias, Shariel D.', date: 'Feb 15–20', status: 'Vacation Leave' },
  ];

  return (
    <>
      <h3><FaUserSlash /> Absent</h3>
      <div className="absent-info">
        <h2>{absentees.length} Employees</h2>
        <p id="absent-date">{updateTime}</p>
        <ul className="absent-list">
          {absentees.map((person, index) => (
            <li key={index}>
              <FaUser />
              <div>
                <strong>{person.name}</strong>
                <span>{person.date}</span>
              </div>
              <span className="badge">{person.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AbsentCard;
// This component displays a list of absent employees with their names, dates, and statuses.
// It also shows the last update time in a formatted manner.