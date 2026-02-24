import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProject } from '../services/api';

export default function SubmitProject() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process materials into array
            const materialsArray = formData.materials.split(',').map(m => m.trim()).filter(m => m);
            // Process instructions into array of steps
            const stepsArray = formData.instructions.split('\n').map(s => s.trim()).filter(s => s);

            const projectData = {
                ...formData,
                budget: Number(formData.budget),
                materials: materialsArray,
                steps: stepsArray,
                instructions: {
                    en: stepsArray
                }
            };

            console.log('📹 Submitting project with videoUrl:', projectData.videoUrl);
            console.log('📦 Full project data:', projectData);

            await createProject(projectData);
            alert("Project submitted successfully! It will be visible in the Library once approved by an Admin.");
            navigate('/projects');
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit project: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: 700, padding: '40px 20px' }}>
            <header style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>Share Your Innovation</h1>
                <p style={{ color: 'var(--text-muted)' }}>Help other teachers by sharing your low-cost STEM project idea.</p>
            </header>

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 25 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Project Title</label>
                    <input
                        name="title"
                        placeholder="e.g., Simple Magnetic Compass"
                        value={formData.title} onChange={handleChange} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Short Description</label>
                    <textarea
                        name="description"
                        placeholder="What is this project about?"
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
                        <label style={{ fontWeight: 600 }}>Estimated Budget (₹)</label>
                        <input
                            type="number" name="budget" placeholder="50"
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
                        <label style={{ fontWeight: 600 }}>Image URL (Optional)</label>
                        <input
                            name="image"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image} onChange={handleChange}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontWeight: 600 }}>YouTube Video URL (Optional)</label>
                        <input
                            name="videoUrl"
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.videoUrl || ""} onChange={handleChange}
                            style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16 }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Materials Required (Comma separated)</label>
                    <textarea
                        name="materials"
                        placeholder="List items like cardboard, bottles, pins..."
                        value={formData.materials} onChange={handleChange} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 100, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontWeight: 600 }}>Step-by-Step Instructions (One per line)</label>
                    <textarea
                        name="instructions"
                        placeholder="Step 1: ...&#10;Step 2: ..."
                        value={formData.instructions} onChange={handleChange} required
                        style={{ padding: 15, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white', minHeight: 150, fontSize: 16, fontFamily: 'inherit' }}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 18, fontSize: 18, marginTop: 10, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Submitting..." : "Submit Project"}
                </button>
            </form>
        </div>
    );
}
