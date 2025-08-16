import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/employee/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      setProfile(response.data);
    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow rounded">
        <Row className="align-items-center mb-3">
          <Col md={2}>
            <img
              src="https://via.placeholder.com/100"
              alt="Avatar"
              className="rounded-circle"
              style={{ width: '100px' }}
            />
          </Col>
          <Col>
            <h4>{profile.name}</h4>
            <p className="text-muted">{profile.position || 'Logistics Driver'}</p>
            <p><strong>Employee ID:</strong> {profile.employee_id || '123456789'}</p>
          </Col>
          <Col md="auto">
            <Button variant="primary" className="me-2" disabled>Edit</Button>
            <Button variant="danger" onClick={handleLogout}>Log Out</Button>
          </Col>
        </Row>

        <hr />

        <h5>Personal Details</h5>
        <Row className="mb-2">
          <Col md={6}><strong>Email Address:</strong> {profile.email}</Col>
          <Col md={6}><strong>Type of Hire:</strong> {profile.hire_type || 'Full-Time'}</Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><strong>Phone:</strong> {profile.phone || 'N/A'}</Col>
          <Col md={6}><strong>Gender:</strong> {profile.gender || 'N/A'}</Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}><strong>Nationality:</strong> {profile.nationality || 'Filipino'}</Col>
          <Col md={6}><strong>Date of Birth:</strong> {profile.birth_date || 'N/A'}</Col>
        </Row>

        <h5>Address</h5>
        <Row>
          <Col md={6}><strong>Address:</strong> {profile.address || 'N/A'}</Col>
          <Col md={6}><strong>City:</strong> {profile.city || 'N/A'}</Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
