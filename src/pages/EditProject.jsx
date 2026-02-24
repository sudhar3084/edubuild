import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, updateProject } from '../services/api';

export default function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subject: "Physics",
        budget: "",
        classLevel: "6-8",
        materials: "",
        instructions: "",
        description: "",
        difficulty: "Medium",
        image: "",
        videoUrl: ""
    });

    useEffect(() => {
        const loadProject = async () => {
            try {
                const project = await getProjectById(id);
                setFormData({
                    title: project.title || "",
                    subject: project.subject || "Physics",
                    budget: project.budget || "",
                    classLevel: project.classLevel || "6-8",
                    materials: Array.isArray(project.materials) ? project.materials.join(', ') : project.materials || "",
                    instructions: project.instructions?.en?.join('\n') || (Array.isArray(project.steps) ? project.steps.join('\n') : ""),
                    description: project.description || "",
                    difficulty: project.difficulty || "Medium",
                    image: project.image || "",
                    videoUrl: project.videoUrl || ""
                });
            } catch (error) {
                console.error("Error loading project:", error);
                alert("Failed to load project details");
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Process materials into array if needed
            const processedMaterials = typeof formData.materials === 'string'
                ? formData.materials.split(',').map(m => m.trim()).filter(m => m)
                : formData.materials;

            // Process instructions into array of steps
            const processedSteps = typeof formData.instructions === 'string'
                ? formData.instructions.split('\n').map(s => s.trim()).filter(s => s)
                : formData.instructions;

            const updateData = {
                ...formData,
                materials: processedMaterials,
                steps: processedSteps,
                // Also update the language-specific instructions if needed by backend
                instructions: {
                    en: processedSteps
                }
            };

            console.log('📹 Updating project with videoUrl:', updateData.videoUrl);
            console.log('📦 Full update data:', updateData);

            await updateProject(id, updateData);
            alert("Project updated successfully!");
            navigate('/admin');
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Update failed: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading project for editing... 🛠️</div>;
    }

    return (
        <div className="container animate-fade" style={{ maxWidth: 700, padding: '40px 20px' }}>
            <header style={{ marginBottom: 40 }}>
                <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: 20 }}>← Back to Dashboard</Link>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Edit Project</h1>
                <p style={{ color: 'var(--text-muted)' }}>Updating: <span style={{ color: 'white' }}>{formData.title}</span></p>
            </header>

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 25 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Project Title</label>
                    <input
                        name="title"
                        value={formData.title} onChange={handleChange} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Short Description</label>
                    <textarea
                        name="description"
                        value={formData.description} onChange={handleChange} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 80, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Subject</label>
                        <select
                            name="subject"
                            value={formData.subject} onChange={handleChange}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        >
                            <option>Physics</option>
                            <option>Chemistry</option>
                            <option>Biology</option>
                            <option>Mathematics</option>
                            <option>Engineering</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Class Level</label>
                        <select
                            name="classLevel"
                            value={formData.classLevel} onChange={handleChange}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        >
                            <option value="6-8">6-8</option>
                            <option value="9-10">9-10</option>
                            <option value="11-12">11-12</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Budget (₹)</label>
                        <input
                            type="number" name="budget"
                            value={formData.budget} onChange={handleChange} required
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty} onChange={handleChange}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>Image URL</label>
                        <input
                            name="image"
                            value={formData.image} onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>YouTube Video URL</label>
                        <input
                            name="videoUrl"
                            value={formData.videoUrl || ""} onChange={handleChange}
                            placeholder="https://youtube.com/watch?v=..."
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Materials (Comma separated)</label>
                    <textarea
                        name="materials"
                        value={formData.materials} onChange={handleChange} required
                        placeholder="Cardboard, Plastic bottle, Tape..."
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 80, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Instructions (One step per line)</label>
                    <textarea
                        name="instructions"
                        value={formData.instructions} onChange={handleChange} required
                        placeholder="Step 1: ...&#10;Step 2: ..."
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 200, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                    <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2, padding: 18, fontSize: 18, opacity: saving ? 0.7 : 1 }}>
                        {saving ? "Saving Changes..." : "Update Project"}
                    </button>
                    <button type="button" onClick={() => navigate('/admin')} className="btn-primary" style={{ flex: 1, padding: 18, fontSize: 18, background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
