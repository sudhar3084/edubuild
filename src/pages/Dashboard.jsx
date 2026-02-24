import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { fetchProjects } from '../data/project'
import { getRecommendations } from '../utils/recommendation'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefBudget, setPrefBudget] = useState(500);
  const [prefClass, setPrefClass] = useState("6-8");
  const [prefSubject, setPrefSubject] = useState("Physics");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setAllProjects(data);
      } catch (error) {
        console.error("Error loading projects on dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recommendations = getRecommendations(allProjects, prefBudget, prefClass, prefSubject);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
      <div className="animate-pulse" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Loading Your Recommendations... 🧬</div>
    </div>;
  }

  return (
    <div className="container animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 8 }}>👋 Hey, {user?.name || "Teacher"}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Ready to inspire your students today with low-cost STEM?</p>
        </div>
        <button onClick={logout} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px 25px' }}>Logout</button>
      </header>

      {/* Filters Card */}
      <section className="glass-card" style={{ padding: 40, marginBottom: 60, border: '1px solid var(--primary)' }}>
        <h3 style={{ marginBottom: 25, display: 'flex', alignItems: 'center', gap: 15, fontSize: '1.5rem' }}>
          <span style={{ fontSize: 32 }}>🪄</span> Smart Recommendation Engine
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Max Budget (₹)</label>
            <input
              type="number" value={prefBudget}
              onChange={e => setPrefBudget(Number(e.target.value))}
              style={{ padding: 15, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Student Class</label>
            <select
              value={prefClass} onChange={e => setPrefClass(e.target.value)}
              style={{ padding: 15, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16, outline: 'none' }}
            >
              <option>6-8</option>
              <option>9-10</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Topic</label>
            <select
              value={prefSubject} onChange={e => setPrefSubject(e.target.value)}
              style={{ padding: 15, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', fontSize: 16, outline: 'none' }}
            >
              <option>Physics</option>
              <option>Math</option>
            </select>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 35 }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Top Matches for You</h2>
            <p style={{ color: 'var(--text-muted)' }}>Projects curated based on your classroom profile.</p>
          </div>
          <Link to="/projects" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', borderBottom: '2px solid var(--primary)', paddingBottom: 4 }}>Browse All Experiments →</Link>
        </div>

        <div className="grid-auto" style={{ gap: 30 }}>
          {recommendations.length > 0 ? recommendations.map(p => (
            <ProjectCard key={p.id} project={p} />
          )) : (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 50, textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem' }}>No projects match your current filters. Try increasing your budget!</p>
            </div>
          )}
        </div>
      </section>

      <section className="glass-card" style={{ padding: 50, textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15))', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ marginBottom: 15, fontSize: '2rem', fontWeight: 800 }}>Build the Future Together</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 35, fontSize: '1.1rem', maxWidth: 700, margin: '0 auto 35px' }}>
          Have you designed a low-cost experiment using waste materials? Share your innovation with thousands of teachers and help democratize STEM education.
        </p>
        <Link to="/submit" className="btn-primary" style={{ textDecoration: 'none', padding: '15px 40px', fontSize: '1.1rem' }}>Submit Your Innovation</Link>
      </section>
    </div>
  )
}



