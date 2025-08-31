import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import JobPostings from "../components/JobPostings";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  faBriefcase,
  faUsers,
  faChartBar,
  faExclamationTriangle,
  faCalendarAlt,
  faUserPlus,
  faClipboardList,
  faSignOutAlt,
  faBars,
  faEnvelope,
  faBell,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HrStaffDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast notification helpers
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);

  // Logout functionality
  const handleLogout = async (e) => {
    e.preventDefault();
    
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      return;
    }

    const loadingToast = toast.loading('Logging out...');

    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      
      if (token) {
        // Optional: Call logout API endpoint if your backend has one
        // This is useful for invalidating tokens on the server side
        try {
          // Uncomment and modify this if you have a logout API endpoint
          // await axios.post('http://localhost:8000/api/logout', {}, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
        } catch (apiError) {
          // Don't prevent logout if API call fails
          console.warn('Logout API call failed:', apiError);
        }
      }

      // Clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      // Clear any other stored user data
      sessionStorage.clear();

      toast.dismiss(loadingToast);
      showSuccess('Logged out successfully!');

      // Redirect to login page after a short delay
      setTimeout(() => {
        // Redirect based on your routing setup
        if (typeof window !== 'undefined') {
          // If using React Router, you might use navigate instead
          window.location.href = '/';
          // Alternative: window.location.replace('/login');
          
          // If you're using React Router with useNavigate:
          // navigate('/login', { replace: true });
        }
      }, 1000);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Logout error:', error);
      showError('Logout failed. Please try again.');
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard";
      case "job-posting":
        return "Job Posting";
      case "employee-record":
        return "Employee Record";
      case "evaluation":
        return "Evaluation";
      case "disciplinary":
        return "Disciplinary Action & Issuance";
      case "leave":
        return "Leave";
      case "recruitment":
        return "Recruitment";
      case "onboarding":
        return "Onboarding";
      default:
        return "Dashboard";
    }
  };

  const renderContent = () => {
    if (activeView === "dashboard") {
      return (
        <>
          {/* Top Row */}
          <div className="row g-4">
            {/* Upcoming Evaluation */}
            <div className="col-md-8">
              <h6 className="text-secondary mb-3">Upcoming Evaluation</h6>
              <div className="row">
                {[1, 2, 3, 4].map((n) => (
                  <div className="col-md-6 mb-3" key={n}>
                    <div className="card shadow-sm rounded-4 p-3">
                      <h6 className="fw-bold">Evaluation {n}</h6>
                      <p className="small text-muted">
                        Evaluation details for employee {n}.
                      </p>
                      <button className="btn btn-primary btn-sm">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="col-md-4">
              <div className="card shadow-sm p-3 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="text-secondary m-0">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="me-2 text-primary"
                    />
                    Calendar
                  </h6>
                  <span className="small text-muted">
                    <FontAwesomeIcon icon={faClock} className="me-1" />
                    {timeNow.toLocaleTimeString()}
                  </span>
                </div>
                <Calendar
                  onChange={setDate}
                  value={date}
                  className="w-100 border-0"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="row g-4 mt-2">
            <div className="col-md-6">
              <div className="card shadow-sm rounded-4 p-3">
                <h6 className="text-secondary mb-2">Leave</h6>
                <p className="small text-muted">
                  No leave requests at the moment.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm rounded-4 p-3">
                <h6 className="text-secondary mb-2">Pending Onboarding</h6>
                <p className="small text-muted">
                  No pending onboarding tasks.
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (activeView === "job-posting") {
      return <JobPostings />;
    }

    return (
      <div className="card p-4">
        <h5>{getHeaderTitle()}</h5>
        <p>This is the {getHeaderTitle()} section.</p>
      </div>
    );
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}
    >
      {/* Sidebar */}
      <div
        className="d-none d-md-flex flex-column bg-dark text-white p-4"
        style={{ width: "18vw", minHeight: "100vh" }}
      >
        <h5 className="mb-4 text-center fw-bold text-uppercase">CCDC</h5>
        <ul className="nav flex-column gap-3">
          <li>
            <button
              onClick={() => setActiveView("dashboard")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faChartBar} className="me-2" /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("job-posting")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faBriefcase} className="me-2" /> Job
              Posting
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("employee-record")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faUsers} className="me-2" /> Employee
              Record
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("evaluation")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faChartBar} className="me-2" /> Evaluation
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("disciplinary")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="me-2"
              />{" "}
              Disciplinary Action
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("leave")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Leave
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("recruitment")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-2" /> Recruitment
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("onboarding")}
              className="btn btn-link text-start text-white nav-link"
            >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />{" "}
              Onboarding
            </button>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button 
            onClick={handleLogout}
            className="btn btn-link nav-link text-danger text-start p-0 w-100"
            style={{ textDecoration: 'none' }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)",
        }}
      >
        {/* Mobile header */}
        <div className="d-md-none d-flex justify-content-between align-items-center p-2 bg-dark text-white">
          <span className="fw-bold">HR Staff</span>
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Header - hidden only for job-posting */}
        <div className="container-fluid py-3 px-3 px-md-5">
          {activeView !== "job-posting" && (
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white rounded-4 shadow-sm p-3 flex-wrap">
              <h4 className="fw-bold text-primary mb-2 mb-md-0">
                {getHeaderTitle()}
              </h4>
              <div className="d-flex align-items-center gap-3">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="lg"
                  className="text-primary"
                />
                <FontAwesomeIcon
                  icon={faBell}
                  size="lg"
                  className="text-primary"
                />
                <span className="fw-semibold text-dark">HR Staff</span>
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: "36px",
                    height: "36px",
                    objectFit: "cover",
                    border: "2px solid #0d6efd",
                  }}
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          {renderContent()}
        </div>
      </div>

      {/* Toast Container */}
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

export default HrStaffDashboard;