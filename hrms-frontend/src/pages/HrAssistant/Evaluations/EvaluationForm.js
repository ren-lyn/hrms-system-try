import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button, Table, Row, Col, Alert } from 'react-bootstrap';
import './EvaluationForm.css';

const criteriaList = [
  {
    id: 'punctuality',
    label: 'Pagpasok sa tamang oras at hindi pagliban (Punctuality & Attendance)',
    description: 'Ang empleyadong ito ay pumapasok sa tamang oras at hindi lumalampas sa oras ng pagpasok. Gayundin ang hindi pagliban o pag-absent sa araw at oras ng trabaho.'
  },
  {
    id: 'attitude',
    label: 'Pag-uugali sa kapwa manggagawa (Attitude towards co-workers)',
    description: 'Nagpapakita ng tama at magandang asal sa mga katrabaho sa loob at labas ng kumpanya nakakataas man o kapwa nya manggagawa.'
  },
  {
    id: 'quality',
    label: 'Kalidad ng trabaho (Quality of work)',
    description: 'Ang bawat gawaing inatas at may kinalaman sa trabaho ay may magandang resulta at pasok sa kalidad na kailangan ng kumpanya at kliyente.'
  },
  {
    id: 'initiative',
    label: 'Pagkukusa (Initiative)',
    description: 'May sariling kusa sa gawain na kailangan sa trabaho at ng kumpanya na hindi kailangan utusan at subaybayan ng mga nakakataas.'
  },
  {
    id: 'teamwork',
    label: 'Pagtutulungan ng magkasama (Teamwork)',
    description: 'Paggawa sa trabaho ng sama-sama at tulung-tulong na hindi nagsisisiilbing pabigat sa ibang kasamahan, at ito ay nagreresulta ng madami at magandang gawa at gawi na produkto.'
  },
  {
    id: 'trustworthy',
    label: 'Mapagkakatiwalaan at Maaasahan (Trustworthy and Reliable)',
    description: 'Ang empleyadong ito ay may tamang pag-uugali kahit hindi man ito binabantayan, may abilidad na iwanan at ihabilin ang mga gawain ng walang pagdududa.'
  }
];

const EvaluationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState({});
  const [average, setAverage] = useState(0);
  const [comments, setComments] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    criteriaList.slice(0, 3), // page 1
    criteriaList.slice(3, 6), // page 2
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const emp = res.data.find((e) => e.id === parseInt(id));
      setEmployee(emp);
    };
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const values = Object.values(scores).map(Number).filter(v => !isNaN(v));
    const avg = values.length ? (values.reduce((a, b) => a + b) / values.length).toFixed(2) : 0;
    setAverage(avg);
  }, [scores]);

  const handleScoreChange = (criterionId, value) => {
    setScores({ ...scores, [criterionId]: value });
  };

  const handleRemarkChange = (criterionId, type, value) => {
    setRemarks({
      ...remarks,
      [criterionId]: {
        ...remarks[criterionId],
        [type]: value,
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/evaluations', {
        employee_id: id,
        scores,
        remarks,
        average_score: average,
        comments
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Evaluation submitted successfully.');
      setTimeout(() => navigate('/dashboard/hr-assistant/evaluation'), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="evaluation-container">
      {employee && currentPage === 0 && (
        <Card className="mb-3 card-employee">
          <h5>{employee.employee_profile?.first_name} {employee.employee_profile?.last_name}</h5>
          <p><strong>Department:</strong> {employee.employee_profile?.department}</p>
          <p><strong>Position:</strong> {employee.employee_profile?.position}</p>
        </Card>
      )}

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="step-indicator">Page {currentPage + 1} of {pages.length}</div>

      <Form onSubmit={handleSubmit}>
        <div className="page-content">
          <Table bordered className="criteria-table">
            <thead>
              <tr>
                <th>KALAGAYAN (Criteria)</th>
                <th>Score (0–10)</th>
                <th>Kahinaan (Weakness)</th>
                <th>Kalakasan (Strength)</th>
              </tr>
            </thead>
            <tbody>
              {pages[currentPage].map((crit) => (
                <tr key={crit.id}>
                  <td>
                    <strong>{crit.label}</strong>
                    <p className="criteria-description">{crit.description}</p>
                  </td>
                  <td>
                    <div className="radio-group">
                      {[...Array(11)].map((_, score) => (
                        <div key={score} className="radio-item">
                          <div>{score}</div>
                          <Form.Check
                            type="radio"
                            name={crit.id}
                            checked={scores[crit.id] === score}
                            onChange={() => handleScoreChange(crit.id, score)}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={remarks[crit.id]?.weakness || ''}
                      onChange={(e) => handleRemarkChange(crit.id, 'weakness', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={remarks[crit.id]?.strength || ''}
                      onChange={(e) => handleRemarkChange(crit.id, 'strength', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {currentPage === pages.length - 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Other Comments</Form.Label>
                <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
              </Form.Group>

              <h5 className="score-display">Kabuuang Puntos (Average Score): {average}</h5>

              <Row className="mt-3">
                <Col><Form.Label>Evaluator’s Name:</Form.Label><Form.Control required /></Col>
                <Col><Form.Label>Date:</Form.Label><Form.Control type="date" required /></Col>
              </Row>
            </>
          )}
        </div>

        <div className="btn-group">
          {currentPage > 0 && <Button variant="secondary" onClick={() => setCurrentPage(currentPage - 1)}>Back</Button>}
          {currentPage < pages.length - 1 ? (
            <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          ) : (
            <Button type="submit" variant="primary">Submit Evaluation</Button>
          )}
          <Button variant="outline-dark" onClick={() => navigate('/dashboard/hr-assistant/evaluation')}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
};

export default EvaluationForm;
