import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const jobs = [
  {
    id: 1,
    title: "SUPPLY CHAIN SUPERVISOR",
    location: "FDC HOME OFFICE - CEBU - NPI",
    type: "Full-time",
    date: "Apr 3 2025 3:33PM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 2,
    title: "CIVIL ENGINEER",
    location: "Cabuyao Plant - Laguna",
    type: "Full-time",
    date: "Mar 28 2025 10:15AM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 3,
    title: "ACCOUNTING STAFF",
    location: "Cebu Office - Finance Department",
    type: "Full-time",
    date: "Mar 25 2025 4:50PM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 4,
    title: "IT SUPPORT SPECIALIST",
    location: "Manila Head Office",
    type: "Full-time",
    date: "Mar 21 2025 9:20AM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 5,
    title: "SALES REPRESENTATIVE",
    location: "Mindanao Branch - Davao City",
    type: "Full-time",
    date: "Mar 18 2025 1:05PM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 6,
    title: "QUALITY CONTROL ANALYST",
    location: "Cabuyao Plant - Laguna",
    type: "Full-time",
    date: "Mar 15 2025 8:45AM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 7,
    title: "MECHANICAL TECHNICIAN",
    location: "Cebu Operations",
    type: "Full-time",
    date: "Mar 12 2025 11:30AM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
  {
    id: 8,
    title: "HUMAN RESOURCES ASSISTANT",
    location: "Manila Head Office",
    type: "Full-time",
    date: "Mar 9 2025 3:00PM",
    logo: "https://i.imgur.com/4YkkuH4.png",
  },
];

const popularSearches = [
  "IT Programmer",
  "Booking Salesman",
  "Accounting Staff",
  "Cashier",
  "Engineering",
  "Inventory Staff",
  "UI/UX Designer",
];

export default function JobPortal() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const scrollToJobs = () => {
    document.getElementById("jobs-section").scrollIntoView({ behavior: "smooth" });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    // Clear localStorage and update state
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserRole(null);
    // Optionally redirect to home or show a message
    window.location.reload(); // Refresh the page to reset any cached data
  };

  const handleApplyClick = (jobTitle = '') => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === 'Applicant') {
      // Handle job application logic here
      alert(`Application submitted for: ${jobTitle}`);
      // You can add actual application logic here
    } else {
      alert("Only applicants can apply for jobs. Please log in with an applicant account.");
    }
  };

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="https://i.imgur.com/4YkkuH4.png"
              alt="FAST Logo"
              style={{ width: 60, height: "auto" }}
            />
            <span className="ms-2 fw-bold">Job Portal</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-white">Browse Jobs</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-white">Contact</button>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <button 
                    className="btn btn-danger ms-2"
                    onClick={handleLogoutClick}
                  >
                    Log Out
                  </button>
                ) : (
                  <button 
                    className="btn btn-success ms-2"
                    onClick={handleLoginClick}
                  >
                    Log In
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Intro Section */}
      <section
        style={{
          height: "100vh",
          backgroundColor: "#1e2a38",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Light Circle Background */}
        <div className="light-circle"></div>
        <div className="light-circle2"></div>

        <div style={{ maxWidth: "650px", position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1rem",
              lineHeight: "1.2",
              animation: "fadeInDown 1.2s ease-out",
            }}
          >
            Welcome, Applicant
          </h1>
          <h3
            style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              animation: "fadeIn 1.5s ease-out",
            }}
          >
            Are you ready to join our team?
          </h3>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#dcdcdc",
              marginBottom: "1.5rem",
              animation: "fadeIn 1.8s ease-out",
            }}
          >
            Cabuyao Concrete Development Corporation is seeking talented and
            motivated individuals to contribute to our growing success. We
            value professionalism, dedication, and a passion for excellence.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "#c0c0c0",
              marginBottom: "2rem",
              animation: "fadeIn 2.1s ease-out",
            }}
          >
            Review the job details below and take the first step towards
            building your career with us.
          </p>
          <button
            onClick={scrollToJobs}
            style={{
              padding: "0.9rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Job Details
          </button>
        </div>

        <style>
          {`
            .light-circle, .light-circle2 {
              position: absolute;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(173, 216, 230, 0.4) 0%, transparent 70%);
              filter: blur(50px);
              animation: moveCircle 10s ease-in-out infinite alternate;
            }

            .light-circle {
              width: 400px;
              height: 400px;
              top: -100px;
              left: -150px;
            }

            .light-circle2 {
              width: 300px;
              height: 300px;
              bottom: -100px;
              right: -150px;
              animation-delay: 3s;
            }

            @keyframes moveCircle {
              0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
              100% { transform: translate(50px, 30px) scale(1.2); opacity: 0.9; }
            }

            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </section>

      {/* Hero Section */}
      <section
        id="jobs-section"
        className="d-flex align-items-center text-white"
        style={{
          background: "linear-gradient(45deg, #0575E6, #021B79)",
          minHeight: "350px",
          padding: "2rem 1rem",
        }}
      >
        <div className="container row align-items-center mx-auto">
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="fw-bold display-5">Find your Dream Job</h1>
            <p className="lead">
              Be a part of a company that invests in your growth and
              development.
            </p>
            <button 
              className="btn btn-light text-dark fw-bold px-4 py-2 mt-2"
              onClick={() => handleApplyClick()}
            >
              Apply Now
            </button>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="https://i.imgur.com/bflYFcF.png"
              alt="Job Illustration"
              className="img-fluid rounded"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container my-5">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search keyword"
            />
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option>Location</option>
              <option>Cebu</option>
              <option>Manila</option>
              <option>Davao</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option>Category</option>
              <option>Engineering</option>
              <option>IT</option>
              <option>Sales</option>
              <option>Accounting</option>
            </select>
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-success">Find Job</button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-4">
          <strong>Popular Search:</strong>{" "}
          {popularSearches.map((item, idx) => (
            <button
              key={idx}
              className="btn btn-outline-primary btn-sm mx-1 my-1"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Job Listing */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Job Listings</h3>
            <button className="btn btn-outline-success">Browse More Jobs</button>
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-white rounded shadow-sm p-4 mb-3"
            >
              <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                <img
                  src={job.logo}
                  alt="Company Logo"
                  style={{ width: 70 }}
                  className="border rounded"
                />
                <div>
                  <h6 className="mb-1 fw-bold">{job.title}</h6>
                  <small className="text-muted d-block">📍 {job.location}</small>
                  <small className="text-muted">🕒 {job.type}</small>
                </div>
              </div>
              <div className="text-md-end">
                <button 
                  className="btn btn-success mb-2"
                  onClick={() => handleApplyClick(job.title)}
                >
                  Apply Now
                </button>
                <div>
                  <small className="text-muted">{job.date}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}