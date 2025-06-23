import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const roleMap = {
    'HR Assistant': 1,
    'HR Staff': 2,
    'Manager': 3,
    'Employee': 4,
  };


  const [formData, setFormData] = useState({
    // name: '', 
    email: '', password: '',
    first_name: '', last_name: '',
    position: '', role_id: '', department: '',
    salary: '', contact_number: '', address: '',
  });
  
  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8000/api/employees', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEmployees(res.data);
  } catch (error) {
    console.error('Error fetching employees:', error.response?.data ?? error.message);
  }
};


  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value,
    ...(name === 'position' && { role_id: roleMap[value] || '' })
  }));
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  try {
    if (editingEmployee) {
      // ✅ PUT (Edit Mode)
      await axios.put(
        `http://localhost:8000/api/employees/${editingEmployee.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } else {
      // ✅ POST (Create Mode)
      await axios.post(
        'http://localhost:8000/api/employees',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }

    setShowModal(false);
    fetchEmployees();
    setEditingEmployee(null);
    setFormData({
      email: '', password: '',
      first_name: '', last_name: '',
      position: '', role_id: '', department: '',
      salary: '', contact_number: '', address: '',
    });
  } catch (error) {
    console.error('Error saving employee:', error.response?.data ?? error.message);
  }
};


  const handleEdit = (emp) => {
  const position = emp.employee_profile?.position || '';
  const role_id = roleMap[position] || '';

  setEditingEmployee(emp);
  setFormData({
    name: emp.name || '',
    email: emp.email || '',
    password: '',
    first_name: emp.employee_profile?.first_name || '',
    last_name: emp.employee_profile?.last_name || '',
    position: position,
    role_id: role_id,
    department: emp.employee_profile?.department || '',
    salary: emp.employee_profile?.salary || '',
    contact_number: emp.employee_profile?.contact_number || '',
    address: emp.employee_profile?.address || '',
  });
  setShowModal(true);
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8000/api/employees/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      // name: '', 
      email: '', password: '',
      first_name: '', last_name: '', position: '', department: '',
      salary: '', contact_number: '', address: '',
    });
  };

  const filteredEmployees = employees.filter(emp => {
    const name = `${emp.employee_profile?.first_name || ''} ${emp.employee_profile?.last_name || ''}`.toLowerCase();
    const dept = emp.employee_profile?.department?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) &&
           dept.includes(departmentFilter.toLowerCase());
  });

  const exportCSV = () => {
    const data = filteredEmployees.map(emp => ({
      Name: `${emp.employee_profile?.first_name} ${emp.employee_profile?.last_name}`,
      Email: emp.email,
      Position: emp.employee_profile?.position,
      Department: emp.employee_profile?.department,
      Salary: emp.employee_profile?.salary,
      Contact: emp.employee_profile?.contact_number,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Email', 'Position', 'Department', 'Salary', 'Contact']],
      body: filteredEmployees.map(emp => [
        `${emp.employee_profile?.first_name} ${emp.employee_profile?.last_name}`,
        emp.email,
        emp.employee_profile?.position,
        emp.employee_profile?.department,
        emp.employee_profile?.salary,
        emp.employee_profile?.contact_number,
      ])
    });
    doc.save('employee_records.pdf');
  };

  return (
    <div>
      

      <div className="employee-records-header">
        <div className="employee-records-controls d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
        </div>
        <div className="employee-records-actions d-flex gap-2 flex-wrap">
          <Button variant="outline-primary" size="sm" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button variant="outline-danger" size="sm" onClick={exportPDF}>
            Export PDF
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            + Add Employee
          </Button>
        </div>
      </div>


      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.employee_profile?.first_name} {emp.employee_profile?.last_name}</td>
              <td>{emp.employee_profile?.position}</td>
              <td>{emp.employee_profile?.department}</td>
              <td>{emp.email}</td>
              <td>{emp.employee_profile?.salary}</td>
              <td>{emp.employee_profile?.contact_number}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(emp)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group> */}
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Text muted>
              Leave password blank if you don't want to change it.
            </Form.Text>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" value={formData.password} onChange={handleInputChange} required={!editingEmployee} />
            </Form.Group>
            <hr />
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first_name" value={formData.first_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" value={formData.last_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
            <Form.Label>Position</Form.Label>
            <Form.Select name="position" value={formData.position} onChange={handleInputChange} required>
              <option value="">Select Position</option>
              <option value="HR Assistant">HR Assistant</option>
              <option value="HR Staff">HR Staff</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </Form.Select>
          </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Department</Form.Label>
              <Form.Control name="department" value={formData.department} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Salary</Form.Label>
              <Form.Control name="salary" type="number" value={formData.salary} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleInputChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeRecords;
