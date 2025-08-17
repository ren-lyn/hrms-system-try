// src/pages/HrAssistant/Evaluations/EmployeeEvaluationList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EmployeeEvaluationList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const filtered = employees.filter(emp => {
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const department = emp.employee_profile?.department?.toLowerCase() || '';
    return (
      name.includes(searchQuery.toLowerCase()) &&
      department.includes(departmentFilter.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return a.first_name.localeCompare(b.first_name);
    } else if (sortBy === 'department') {
      return (a.employee_profile?.department || '').localeCompare(b.employee_profile?.department || '');
    }
    return 0;
  });

  return (
    <div>
      <h3 className="fw-bold mb-3">Employee Evaluation</h3>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        />
        <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort</option>
          <option value="name">Sort by Name</option>
          <option value="department">Sort by Department</option>
        </Form.Select>
      </div>
      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(emp => (
            <tr key={emp.id}>
              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.employee_profile?.department || '—'}</td>
              <td>{emp.employee_profile?.position || '—'}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/dashboard/hr-assistant/evaluation/${emp.id}/form`)}
                >
                  Evaluate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeEvaluationList;
