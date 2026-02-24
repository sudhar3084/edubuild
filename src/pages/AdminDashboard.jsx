import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchProjects, deleteProject, updateProjectStatus } from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        alert('Project deleted successfully');
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateProjectStatus(id, status);
      setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
      alert(`Project ${status} successfully`);
    } catch (error) {
      alert('Failed to update project status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <Link to="/submit" className="btn-primary" style={{ padding: '12px 24px' }}>+ Add New Project</Link>
          <button onClick={logout} className="btn-primary" style={{ padding: '12px 24px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Logout</button>
        </div>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '20px' }}>Project Title</th>
                <th style={{ padding: '20px' }}>Subject</th>
                <th style={{ padding: '20px' }}>Level</th>
                <th style={{ padding: '20px' }}>Budget</th>
                <th style={{ padding: '20px' }}>Status</th>
                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>No projects found.</td>
                </tr>
              ) : (
                projects.map(project => (
                  <tr key={project.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '20px', fontWeight: 600 }}>{project.title}</td>
                    <td style={{ padding: '20px' }}><span className="badge" style={{ fontSize: 12 }}>{project.subject}</span></td>
                    <td style={{ padding: '20px' }}>{project.classLevel}</td>
                    <td style={{ padding: '20px' }}>₹{project.budget}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: `${getStatusColor(project.status)}20`,
                        color: getStatusColor(project.status),
                        border: `1px solid ${getStatusColor(project.status)}50`
                      }}>
                        {project.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {project.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(project.id, 'approved')} className="btn-primary" style={{ padding: '8px 12px', fontSize: 12, background: 'rgba(16, 185, 129, 0.4)' }}>Approve</button>
                            <button onClick={() => handleStatusUpdate(project.id, 'rejected')} className="btn-primary" style={{ padding: '8px 12px', fontSize: 12, background: 'rgba(239, 68, 68, 0.4)' }}>Reject</button>
                          </>
                        )}
                        <Link to={`/project/${project.id}`} className="btn-primary" style={{ padding: '8px 12px', fontSize: 12, background: 'var(--surface)' }}>View</Link>
                        <Link to={`/edit-project/${project.id}`} className="btn-primary" style={{ padding: '8px 12px', fontSize: 12, background: 'rgba(99, 102, 241, 0.4)' }}>Edit</Link>
                        <button onClick={() => handleDelete(project.id, project.title)} className="btn-primary" style={{ padding: '8px 12px', fontSize: 12, background: 'rgba(239, 68, 68, 0.4)' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
