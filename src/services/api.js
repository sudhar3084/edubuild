import api from '../api/axios';

export const fetchProjects = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.budget) params.append('budget', filters.budget);
    if (filters.classLevel) params.append('classLevel', filters.classLevel);
    if (filters.subject) params.append('subject', filters.subject);

    const response = await api.get(`/projects${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const updateProjectStatus = async (id, status) => {
  try {
    const response = await api.patch(`/projects/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const explainProjectWithAI = async (projectData) => {
  try {
    const response = await api.post('/ai/explain', projectData);
    return response.data;
  } catch (error) {
    console.error('Error getting AI explanation:', error);
    throw error;
  }
};

export default api;
