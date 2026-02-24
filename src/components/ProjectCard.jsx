import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProjectCard = ({ project, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);

    const isOwner = user && project.createdBy === user.id;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isOwner || isAdmin;

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            setDeleting(true);
            try {
                await api.delete(`/projects/${project.id}`);
                alert('Project deleted successfully!');
                if (onDeleteSuccess) onDeleteSuccess();
                navigate('/projects');
            } catch (error) {
                alert('Error deleting project: ' + (error.response?.data?.message || error.message));
            } finally {
                setDeleting(false);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-project/${project.id}`);
    };
    return (
        <div className="glass-card animate-fade" style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'default'
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={project.image || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800";
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(5px)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    ⭐ {project.rating}
                </div>
                <div className="badge" style={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    background: 'var(--primary)',
                    color: 'white',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)'
                }}>
                    {project.subject}
                </div>
                {project.videoUrl && (
                    <div style={{
                        position: 'absolute',
                        bottom: 15,
                        left: 15,
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <span>▶</span> VIDEO GUIDE
                    </div>
                )}
            </div>

            <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>{project.title}</h3>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1, lineHeight: '1.6' }}>
                    {project.concept ? (project.concept.length > 90 ? project.concept.substring(0, 90) + '...' : project.concept) : `Engaging ${project.subject} project for Class ${project.classLevel}.`}
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: 11 }}>
                        Class {project.classLevel}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: 11 }}>
                        {project.difficulty}
                    </span>
                </div>

                <hr style={{ borderColor: 'var(--glass-border)', margin: '5px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Est. Cost</span>
                        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>₹{project.budget || project.diyPrice}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/project/${project.id}`} className="btn-primary" style={{
                            padding: '10px 22px',
                            fontSize: 14,
                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                        }}>
                            View Guide
                        </Link>
                        {canEdit && (
                            <>
                                <button onClick={handleEdit} className="btn-primary" style={{
                                    padding: '10px 12px',
                                    fontSize: 14,
                                    background: 'rgba(99, 102, 241, 0.6)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    color: 'white',
                                }}>
                                    ✏️ Edit
                                </button>
                                <button onClick={handleDelete} disabled={deleting} className="btn-primary" style={{
                                    padding: '10px 12px',
                                    fontSize: 14,
                                    background: 'rgba(239, 68, 68, 0.6)',
                                    border: 'none',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    borderRadius: '8px',
                                    color: 'white',
                                    opacity: deleting ? 0.6 : 1,
                                }}>
                                    {deleting ? '⏳' : '🗑️'} Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
