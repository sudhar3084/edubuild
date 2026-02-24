// Google Sheets integration for submitting projects
export const submitProject = async (projectData) => {
  try {
    // For now, submit to backend API instead of Google Sheets
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting project:', error);
    throw error;
  }
};

export default {
  submitProject
};
