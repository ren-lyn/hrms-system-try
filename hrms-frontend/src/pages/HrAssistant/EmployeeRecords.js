import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    email: '', password: '',
    first_name: '', last_name: '',
    position: '', role_id: '', department: '',
    salary: '', contact_number: '', address: '',
  });

  const showError = (message) => toast.error(message);
  const showSuccess = (message) => toast.success(message);
  const showWarning = (message) => toast.warning(message);
  const showInfo = (message) => toast.info(message);

  // ✅ Common error handler
  const handleAxiosError = (error, defaultMessage) => {
  console.error('Axios error:', error);

  if (error.response) {
    if (error.response.status === 401) {
      showError('Authentication failed. Please log in again.');
    } else if (error.response.status === 403) {
      showError('Access denied. You don\'t have permission to perform this action.');
    } else if (error.response.status === 404) {
      showWarning('Resource not found.');
    } else if (error.response.status === 409) {
      // ✅ Handle duplicate email or name
      const message = error.response.data?.message || '';
      if (message.toLowerCase().includes('email')) {
        showError('Email already exists. Please use a different email address.');
      } else if (message.toLowerCase().includes('name')) {
        showError('An employee with the same first and last name already exists.');
      } else {
        showError(message || 'Conflict error. Please check your input.');
      }
    } else if (error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat();
        showError(`Validation error: ${errorMessages.join(', ')}`);
      } else {
        showError('Validation failed. Please check your input.');
      }
    } else if (error.response.status >= 500) {
      showError('Server error occurred. Please try again later.');
    } else {
      showError(error.response.data?.message || defaultMessage);
    }
  } else if (error.request) {
    showError('Network error. Please check your internet connection.');
  } else if (error.code === 'ERR_NETWORK') {
    showError('Network error. Please check your internet connection.');
  } else if (error.code === 'ECONNABORTED') {
    showError('Request timed out. Please try again.');
  } else {
    showError(defaultMessage);
  }
};


  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Authentication token not found. Please log in again.');
        return;
      }

      const res = await axios.get('http://localhost:8000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);

      if (res.data.length === 0) {
        showInfo('No employees found.');
      }
    } catch (error) {
      handleAxiosError(error, 'Failed to load employee records. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

    if (!token) {
      showError('Authentication token not found. Please log in again.');
      return;
    }

    if (!formData.email || !formData.first_name || !formData.last_name || !formData.position) {
      showError('Please fill in all required fields.');
      return;
    }

    if (!editingEmployee && !formData.password) {
      showError('Password is required for new employees.');
      return;
    }

    const loadingToast = toast.loading(editingEmployee ? 'Updating employee...' : 'Adding employee...');

    try {
      if (editingEmployee) {
        await axios.put(
          `http://localhost:8000/api/employees/${editingEmployee.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.dismiss(loadingToast);
        showSuccess(`Employee ${formData.first_name} ${formData.last_name} updated successfully!`);
      } else {
        await axios.post(
          'http://localhost:8000/api/employees',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.dismiss(loadingToast);
        showSuccess(`Employee ${formData.first_name} ${formData.last_name} added successfully!`);
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
      toast.dismiss(loadingToast);
      handleAxiosError(error, editingEmployee ? 'Failed to update employee. Please try again.' : 'Failed to add employee. Please try again.');
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
    showInfo(`Editing ${emp.employee_profile?.first_name} ${emp.employee_profile?.last_name}'s profile`);
  };

  const handleDelete = async (id, employeeName = 'this employee') => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      const loadingToast = toast.loading('Deleting employee...');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.dismiss(loadingToast);
          showError('Authentication token not found. Please log in again.');
          return;
        }

        await axios.delete(`http://localhost:8000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.dismiss(loadingToast);
        showSuccess(`${employeeName} deleted successfully!`);
        fetchEmployees();
      } catch (error) {
        toast.dismiss(loadingToast);
        handleAxiosError(error, 'Failed to delete employee. Please try again.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
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
    try {
      if (filteredEmployees.length === 0) {
        showWarning('No employee data to export.');
        return;
      }

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
      URL.revokeObjectURL(url);

      showSuccess(`CSV file exported successfully! (${filteredEmployees.length} employees)`);
    } catch (error) {
      handleAxiosError(error, 'Failed to export CSV file. Please try again.');
    }
  };

  const exportPDF = () => {
    try {
      if (filteredEmployees.length === 0) {
        showWarning('No employee data to export.');
        return;
      }

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

      showSuccess(`PDF file exported successfully! (${filteredEmployees.length} employees)`);
    } catch (error) {
      handleAxiosError(error, 'Failed to export PDF file. Please try again.');
    }
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
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleDelete(
                    emp.id, 
                    `${emp.employee_profile?.first_name} ${emp.employee_profile?.last_name}`
                  )}
                >
                  Delete
                </Button>
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

            {/* Toast container */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </div>
  );
};

export default EmployeeRecords;
