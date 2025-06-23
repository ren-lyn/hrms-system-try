// src/components/HrAssistant/Dashboard/CalendarWidget.js
import React, { useEffect, useState } from 'react';

const CalendarWidget = () => {
  const [calendarHTML, setCalendarHTML] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let days = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
    days += `<div class="calendar-grid">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>`;

    for (let i = 0; i < firstDay; i++) {
      days += `<span></span>`;
    }

    for (let i = 1; i <= lastDate; i++) {
      const isToday = i === today.getDate() ? 'today' : '';
      days += `<span class="${isToday}">${i}</span>`;
    }

    days += `</div>`;
    setCalendarHTML(days);
  }, []);

  return <div id="calendar" dangerouslySetInnerHTML={{ __html: calendarHTML }} />;
};

export default CalendarWidget;
