import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      login: email,
      password,
    });

    const { access_token, user } = response.data;

    // Store in localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    // ✅ Set axios Authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    // Redirect based on role
    switch (user.role.name) {
      case 'HR Assistant':
        navigate('/dashboard/hr-assistant');
        break;
      case 'HR Staff':
        navigate('/dashboard/hr-staff');
        break;
      case 'Manager':
        navigate('/dashboard/manager');
        break;
      case 'Applicant':
        navigate('/dashboard/applicant');
        break;
      case 'Employee':
        navigate('/dashboard/employee');
        break;
      default:
        navigate('/unauthorized');
        break;
    }
  } catch (err) {
    setError('Login failed. Check your credentials.');
  }
};


  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row shadow-lg rounded overflow-hidden w-75">
        {/* Left side */}
        <div className="col-md-6 bg-primary text-white p-5 d-flex flex-column justify-content-center">
          <h4 className="mb-3 text-uppercase">Welcome to</h4>
          <h2 className="fw-bold">Cabuyao Concrete<br />Development Corporation | HRMS</h2>
          <p className="mt-4">Login to your Account <i className="bi bi-box-arrow-in-right"></i></p>
        </div>

        {/* Right side */}
        <div className="col-md-6 bg-white p-5">
          <h4 className="text-center mb-4">Sign in to your account</h4>

          <div className="d-flex justify-content-center mb-4">
            <button
              className={`btn btn-sm ${role === 'Admin' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setRole('Admin')}
            >
              Admin
            </button>
            <button
              className={`btn btn-sm ${role === 'Employee' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setRole('Employee')}
            >
              Employee
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="User ID (1-4) or Email (Applicant)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Employee ID No. (Password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>

          <div className="text-center mt-3">
            <small>Don't have an account? </small>
            <button
              className="btn btn-link p-0"
              onClick={() => navigate('/register')}
            >
              Register as Applicant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
