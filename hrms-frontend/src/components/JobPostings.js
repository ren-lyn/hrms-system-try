import React, { useState } from "react";
import { Card, Button, Form, Modal, Collapse, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";

const JobPostings = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    id: null,
    title: "",
    description: "",
    requirements: "",
    status: "Open", // default status
  });
  const [isEditing, setIsEditing] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setCurrentJob({ ...currentJob, [e.target.name]: e.target.value });
  };

  // Add new job
  const handleAdd = () => {
    setCurrentJob({
      id: null,
      title: "",
      description: "",
      requirements: "",
      status: "Open",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Edit job
  const handleEdit = (job) => {
    setCurrentJob(job);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete job
  const handleDelete = (id) => {
    setJobPosts(jobPosts.filter((job) => job.id !== id));
  };

  // Toggle job status (Open/Closed)
  const handleToggleStatus = (id) => {
    setJobPosts(
      jobPosts.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "Open" ? "Closed" : "Open" }
          : job
      )
    );
  };

  // Save job (add or edit)
  const handleSave = () => {
    if (isEditing) {
      setJobPosts(
        jobPosts.map((job) => (job.id === currentJob.id ? currentJob : job))
      );
    } else {
      setJobPosts([...jobPosts, { ...currentJob, id: Date.now() }]);
    }
    setShowModal(false);
  };

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div
      className="p-4 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8f9fc 0%, #e8ecf5 100%)",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary d-flex align-items-center">
          <i className="bi bi-briefcase-fill me-2"></i> Job Postings
        </h2>
        <Button
          variant="primary"
          className="shadow-sm rounded-pill px-4"
          onClick={handleAdd}
        >
          <i className="bi bi-plus-circle me-2"></i> Add Job
        </Button>
      </div>

      {/* Empty State */}
      {jobPosts.length === 0 ? (
        <motion.div
          className="text-center text-muted mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="bi bi-clipboard2-x display-1 text-secondary mb-3"></i>
          <p className="fs-4 fw-semibold">No job postings available</p>
          <p className="small fst-italic">
            Click <strong>Add Job</strong> to create your first posting.
          </p>
        </motion.div>
      ) : (
        <div className="row">
          <AnimatePresence>
            {jobPosts.map((job) => (
              <motion.div
                key={job.id}
                className="col-md-6 col-lg-4 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="shadow border-0 h-100 rounded-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Card.Title className="fw-bold text-dark">
                          {job.title}
                        </Card.Title>
                        <Badge
                          bg={job.status === "Open" ? "success" : "danger"}
                          className="rounded-pill px-3 py-1"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2 rounded-circle"
                          onClick={() => handleToggleStatus(job.id)}
                          title="Toggle Open/Close"
                        >
                          <i
                            className={
                              job.status === "Open"
                                ? "bi bi-toggle-on"
                                : "bi bi-toggle-off"
                            }
                          ></i>
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-circle"
                          onClick={() => handleEdit(job)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleDelete(job.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>

                    {/* Expandable content */}
                    <Collapse in={expandedJob === job.id}>
                      <div className="mt-2 mb-2">
                        <Card.Text className="text-secondary small">
                          <strong>Description:</strong> {job.description}
                        </Card.Text>
                        <Card.Text className="text-secondary small">
                          <strong>Requirements:</strong> {job.requirements}
                        </Card.Text>
                      </div>
                    </Collapse>

                    <div className="mt-auto">
                      <Button
                        variant="link"
                        className="p-0 mt-2 text-decoration-none fw-semibold"
                        onClick={() => toggleExpand(job.id)}
                      >
                        {expandedJob === job.id ? (
                          <>
                            Show Less <i className="bi bi-chevron-up"></i>
                          </>
                        ) : (
                          <>
                            Show More <i className="bi bi-chevron-down"></i>
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="rounded-4"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #0d6efd, #4e9bff)",
            color: "white",
          }}
        >
          <Modal.Title className="fw-bold">
            {isEditing ? "Edit Job Posting" : "Add Job Posting"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentJob.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={currentJob.description}
                onChange={handleChange}
                placeholder="Enter job description"
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Requirements</Form.Label>
              <Form.Control
                as="textarea"
                name="requirements"
                rows={2}
                value={currentJob.requirements}
                onChange={handleChange}
                placeholder="Enter job requirements"
                className="rounded-3"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            background: "rgba(248, 249, 250, 0.9)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Button
            variant="outline-secondary"
            className="rounded-pill px-3"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={handleSave}
          >
            {isEditing ? (
              <>
                <i className="bi bi-check-circle me-1"></i> Save Changes
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i> Add Job
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobPostings;
