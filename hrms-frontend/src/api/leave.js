import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

export const fetchLeaves = () => API.get('/leaves');
export const getLeave = (id) => API.get(`/leaves/${id}`);
export const approveLeave = (id) => API.put(`/leaves/${id}/approve`);
export const rejectLeave = (id) => API.put(`/leaves/${id}/reject`);
