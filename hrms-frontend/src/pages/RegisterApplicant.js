import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterApplicant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    resume: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8000/api/register', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #bfdbfe 0%, #7dd3fc 25%, #3b82f6 75%, #1e40af 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        html, body, #root {
          height: 100%;
        }
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          min-height: 100vh;
          width: 100vw;
          overflow-y: auto;
        }
        * { box-sizing: border-box; }

        .register-wrapper {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          width: 100%;
          position: relative;
        }

        .register-header {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(30, 64, 175, 0.05));
          padding: 50px 40px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          position: relative;
        }

        .register-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
        }

        .back-home-btn {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(59,130,246,0.10);
          color: #1e40af;
          border: none;
          border-radius: 8px;
          padding: 7px 16px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(30,64,175,0.08);
          transition: background 0.2s, color 0.2s;
          z-index: 10;
        }
        .back-home-btn:hover {
          background: rgba(59,130,246,0.18);
          color: #2563eb;
        }

        .header-icon {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
          border: 4px solid rgba(255, 255, 255, 0.9);
        }

        .register-body {
          padding: 40px;
          background: #ffffff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 20px;
          color: #9ca3af;
          font-size: 18px;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 18px 20px 18px 55px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          background: #f9fafb;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .register-button {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          border: none;
          padding: 20px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 20px;
        }

        .register-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
        }

        .alert {
          padding: 16px 20px;
          border-radius: 10px;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
        }

        .alert-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
        }

        .alert-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
        }

        .login-link {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }

        .login-link button {
          color: #3b82f6;
          background: none;
          border: none;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
        }

        .login-link button:hover {
          color: #1e40af;
        }

        .required-indicator {
          color: #ef4444;
          margin-left: 3px;
        }

        @media (max-width: 768px) {
          .register-header {
            padding: 30px 25px 20px;
          }
          .register-body {
            padding: 25px 20px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .header-icon {
            width: 70px;
            height: 70px;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .register-header {
            padding: 25px 20px 15px;
          }
          .register-body {
            padding: 20px 15px;
          }
          .form-input {
            padding: 15px 15px 15px 45px;
            font-size: 14px;
          }
          .input-icon {
            left: 15px;
            font-size: 16px;
          }
          .header-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 15px;
          }
          .form-grid {
            gap: 15px;
            margin-bottom: 15px;
          }
          .form-group {
            margin-bottom: 20px;
          }
        }
      `}</style>

      <div className="register-wrapper">
        <div className="register-card">
          {/* Header Section */}
          <div className="register-header">
            {/* Back to Home button */}
            <button
              className="back-home-btn"
              onClick={() => navigate('/')}
              type="button"
            >
              ← Home
            </button>
            <div className="header-icon">
              <i className="bi bi-person-plus-fill text-white" style={{ fontSize: '2.2rem' }}></i>
            </div>
            <h2 style={{
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '10px',
              fontSize: '1.8rem'
            }}>
              Applicant Registration
            </h2>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Join Cabuyao Concrete Development Corporation<br />
              Create your account to apply for positions
            </p>
          </div>

          {/* Body Section */}
          <div className="register-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleRegister}>
              {/* Personal Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Personal Information
                </h4>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      First Name <span className="required-indicator">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        type="text"
                        className="form-input"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Last Name <span className="required-indicator">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        type="text"
                        className="form-input"
                        name="last_name"
                        placeholder="Enter your last name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Contact Information
                </h4>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required-indicator">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="bi bi-envelope input-icon"></i>
                    <input
                      type="email"
                      className="form-input"
                      name="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number
                  </label>
                  <div className="input-wrapper">
                    <i className="bi bi-telephone input-icon"></i>
                    <input
                      type="text"
                      className="form-input"
                      name="phone"
                      placeholder="Enter your phone number (optional)"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Account Security
                </h4>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Password <span className="required-indicator">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-lock input-icon"></i>
                      <input
                        type="password"
                        className="form-input"
                        name="password"
                        placeholder="Create a secure password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Confirm Password <span className="required-indicator">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-shield-lock input-icon"></i>
                      <input
                        type="password"
                        className="form-input"
                        name="password_confirmation"
                        placeholder="Confirm your password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <i className="bi bi-info-circle" style={{
                    color: '#3b82f6',
                    fontSize: '1.2rem',
                    marginTop: '2px'
                  }}></i>
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: '1.5'
                    }}>
                      By creating an account, you agree to our Terms of Service and Privacy Policy. 
                      Your information will be used solely for recruitment and application purposes.
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" className="register-button">
                Create Account
              </button>
            </form>

            <div className="login-link">
              <span>Already have an account? </span>
              <button onClick={() => navigate('/login')}>
                Sign in here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterApplicant;