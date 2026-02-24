import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../data/project';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/ProjectCard';

import { useLocation } from 'react-router-dom';

export default function ProjectList() {
    const { language, translate } = useLanguage();
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterBudget, setFilterBudget] = useState(1000);
    const [filterClass, setFilterClass] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Check for query params (e.g. from Waste Scanner)
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [location]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProjects();
                setAllProjects(data);
            } catch (error) {
                console.error("Error loading library projects:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredProjects = allProjects.filter(p => {
        const matchesBudget = (p.budget || p.diyPrice || 0) <= filterBudget;
        const matchesClass = filterClass === "All" || p.classLevel === filterClass;
        const matchesSearch = searchQuery === "" ||
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.concept?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.materials?.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesBudget && matchesClass && matchesSearch;
    });

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
            <div className="animate-pulse" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Exploring the Experiment Library... 🔍</div>
        </div>;
    }

    return (
        <div className="container animate-fade">
            <header style={{ marginBottom: 30 }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 15, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {translate('lib.title')}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600 }}>
                    {translate('lib.subtitle')}
                </p>
                <div style={{ marginTop: 20, display: 'flex', gap: 15 }}>
                    <a href="/submit" className="btn-primary" style={{ padding: '12px 25px', fontSize: 16, textDecoration: 'none' }}>
                        ➕ {translate('lib.contribute')}
                    </a>
                    <a href="/scanner" className="btn-primary" style={{ padding: '12px 25px', fontSize: 16, textDecoration: 'none', background: 'var(--accent)' }}>
                        📸 AI Material Scanner
                    </a>
                </div>
            </header>

            {/* Search Bar */}
            <div className="glass-card" style={{ marginBottom: 30, padding: '15px 25px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        🔍
                    </div>
                    <input
                        type="text"
                        placeholder={translate('lib.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 60px 18px 50px',
                            borderRadius: 12,
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            fontSize: 16,
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            style={{
                                position: 'absolute',
                                right: 15,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: 18,
                                color: 'var(--text-muted)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.1)';
                                e.target.style.color = 'var(--text-muted)';
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: 50, padding: 35, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 250 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, fontWeight: 600 }}>
                        <span>{translate('lib.maxBudget')}</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>₹{filterBudget}</span>
                    </label>
                    <input
                        type="range" min="0" max="2000" step="50"
                        value={filterBudget} onChange={e => setFilterBudget(e.target.value)}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 250 }}>
                    <label style={{ display: 'block', marginBottom: 15, fontWeight: 600 }}>{translate('lib.filterClass')}</label>
                    <select
                        value={filterClass} onChange={e => setFilterClass(e.target.value)}
                        style={{ width: '100%', padding: '15px 20px', borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16, outline: 'none' }}
                    >
                        <option value="All">{translate('lib.allClasses')}</option>
                        <option value="6-8">{translate('lib.middleSchool')}</option>
                        <option value="9-10">{translate('lib.highSchool')}</option>
                    </select>
                </div>

                <div style={{ flex: 0.5, textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{filteredProjects.length}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{translate('lib.projectsFound')}</div>
                </div>
            </div>

            <div className="grid-auto" style={{ gap: 30 }}>
                {filteredProjects.length > 0 ? filteredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                )) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 80, textAlign: 'center' }}>
                        <div style={{ fontSize: 60, marginBottom: 20 }}>🔭</div>
                        <h2 style={{ marginBottom: 10 }}>No experiments found</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Try adjusting your filters to discover more hidden gems.</p>
                        <button onClick={() => { setFilterBudget(2000); setFilterClass("All"); setSearchQuery(""); }} className="btn-primary" style={{ marginTop: 30 }}>Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}



