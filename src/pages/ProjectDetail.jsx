import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import StoreLocator from '../components/StoreLocator';
import { deleteProject } from '../services/api';
import jsPDF from 'jspdf';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, translate } = useLanguage();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadProject = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Fetching project with ID:', id);

            const projectData = await getProjectById(id);
            console.log('✅ Project data received:', projectData);
            setProject(projectData);
        } catch (error) {
            console.error("❌ Error loading project detail:", error);
            console.error("Error details:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || "Failed to load project");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
        // eslint-disable-next-line
    }, [id]);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading Project Details... 🧬</div>;
    }

    if (error) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
                <h2 style={{ color: '#ef4444', marginBottom: 20 }}>⚠️ Error Loading Project</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>{error}</p>
                <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                    <button onClick={loadProject} className="btn-primary">Try Again</button>
                    <Link to="/projects" className="btn-primary" style={{ background: 'var(--surface)' }}>{translate('detail.back')}</Link>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
                <h2>Project not found</h2>
                <Link to="/projects" className="btn-primary" style={{ marginTop: 20 }}>{translate('detail.back')}</Link>
            </div>
        );
    }

    const instructions = (project.instructions && project.instructions[language]) ||
        (project.instructions && project.instructions['en']) ||
        project.steps ||
        [];
    const isOwner = user && project.createdBy === user.id;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isOwner || isAdmin;

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(project.title || 'Project Guide', 10, 10);
        doc.setFontSize(12);
        doc.text(`Subject: ${project.subject || 'N/A'}`, 10, 20);
        doc.text(`Materials: ${Array.isArray(project.materials) ? project.materials.join(', ') : 'N/A'}`, 10, 30);
        doc.text("Instructions:", 10, 40);
        instructions.forEach((line, i) => {
            doc.text(`${i + 1}. ${line}`, 10, 50 + (i * 10));
        });
        doc.save(`${project.title || 'project'}.pdf`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            setDeleting(true);
            try {
                await deleteProject(project.id);
                alert('Project deleted successfully!');
                navigate('/projects');
            } catch (error) {
                alert('Error deleting project: ' + (error.response?.data?.message || error.message));
                setDeleting(false);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-project/${project.id}`);
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: 900 }}>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: 20 }}>← {translate('detail.back')}</Link>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: 10 }}>{project.title}</h1>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span className="badge">{project.classLevel}</span>
                        <span className="badge" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>{project.subject}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {project.videoUrl && (
                        <a
                            href={project.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                fontSize: 14,
                                background: '#FF0000',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            ▶ {translate('detail.watchVideo')} ↗
                        </a>
                    )}
                    <button onClick={downloadPDF} className="btn-primary" style={{ fontSize: 14 }}>⬇ {translate('detail.savePdf')}</button>
                    {canEdit && (
                        <>
                            <button onClick={handleEdit} className="btn-primary" style={{
                                fontSize: 14,
                                background: 'rgba(99, 102, 241, 0.6)'
                            }}>✏️ {translate('detail.edit')}</button>
                            <button onClick={handleDelete} disabled={deleting} className="btn-primary" style={{
                                fontSize: 14,
                                background: 'rgba(239, 68, 68, 0.6)',
                                opacity: deleting ? 0.6 : 1,
                                cursor: deleting ? 'not-allowed' : 'pointer'
                            }}>
                                {deleting ? `⏳ ${translate('detail.deleting')}` : `🗑️ ${translate('detail.delete')}`}
                            </button>
                        </>
                    )}
                </div>
            </header>

            {project.image && (
                <div style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: 40 }}>
                    <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800";
                        }}
                    />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
                <div className="glass-card" style={{ padding: 25, borderLeft: '4px solid var(--accent)' }}>
                    <h3 style={{ marginBottom: 15, fontSize: 18 }}>💰 {translate('detail.budget')}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span>{translate('detail.cost')}:</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{project.budget}</span>
                    </div>
                    <div style={{ background: 'rgba(255,158,11,0.1)', padding: 10, borderRadius: 8, textAlign: 'center', marginTop: 15 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget-friendly & accessible</span>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: 25, borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: 15, fontSize: 18 }}>🧠 {translate('detail.learningOutcomes')}</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(project.learningOutcomes || ["STEM Learning", "Innovation"]).map((l, i) => (
                            <li key={i} style={{ marginBottom: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--primary)' }}>✔</span> {l}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 35, marginBottom: 40 }}>
                <h3 style={{ marginBottom: 20 }}>🛠 {translate('detail.materials')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {Array.isArray(project.materials) && project.materials.length > 0 ? project.materials.map((m, i) => (
                        <span key={i} style={{ background: 'var(--surface)', padding: '8px 16px', borderRadius: 10, border: '1px solid var(--glass-border)', fontSize: 14 }}>
                            {m}
                        </span>
                    )) : <p>No materials listed</p>}
                </div>
                <StoreLocator />
            </div>

            <div className="glass-card" style={{ padding: 35, marginBottom: 40, background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginBottom: 25, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📝 {translate('detail.instructions')}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{language.toUpperCase()}</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                    {instructions.length > 0 ? instructions.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 20 }}>
                            <div style={{
                                minWidth: 40, height: 40, borderRadius: '50%', background: 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                            }}>{i + 1}</div>
                            <p style={{ fontSize: '1.1rem', paddingTop: 8 }}>{step}</p>
                        </div>
                    )) : <p>No instructions available for this language.</p>}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 30, marginBottom: 40, border: '1px solid var(--accent)', background: 'rgba(245,158,11,0.05)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>💡 {translate('detail.about')}</h4>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{project.description}</p>
            </div>

            <AiAssistant project={project} />

            <FeedbackForm projectId={project.id} />
        </div >
    );
}

const AiAssistant = ({ project }) => {
    const { translate, language } = useLanguage();
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExplain = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await import('../services/api').then(m => m.explainProjectWithAI({
                title: project.title,
                description: project.description,
                materials: project.materials,
                language: language === 'hi' ? 'hindi' : language === 'tel' ? 'telugu' : 'english'
            }));
            setExplanation(data.explanation);
        } catch (err) {
            setError(err.response?.data?.message || "AI is currently taking a coffee break. Please try again later!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: 35, marginBottom: 40, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                <div style={{ fontSize: 32 }}>🤖</div>
                <div>
                    <h3 style={{ margin: 0 }}>{translate('detail.aiTitle')}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>{translate('detail.aiPrompt')}</p>
                </div>
            </div>

            {!explanation && !loading && (
                <button
                    onClick={handleExplain}
                    className="btn-primary"
                    style={{ background: 'var(--primary)', color: 'black', fontWeight: 700 }}
                >
                    {translate('detail.aiButton')}
                </button>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <div className="animate-pulse" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        ⏳ {translate('detail.aiLoading')}
                    </div>
                </div>
            )}

            {error && (
                <div style={{ color: '#ef4444', padding: 15, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 10, fontSize: 14 }}>
                    ⚠️ {error}
                </div>
            )}

            {explanation && (
                <div className="animate-fade" style={{ background: 'rgba(255,255,255,0.05)', padding: 25, borderRadius: 15, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {explanation}
                    <button
                        onClick={() => setExplanation("")}
                        style={{ display: 'block', marginTop: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
                    >
                        Close Explanation
                    </button>
                </div>
            )}
        </div>
    );
};
