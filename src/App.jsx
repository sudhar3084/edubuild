import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import SubmitProject from './pages/SubmitProject';
import EditProject from './pages/EditProject';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import WasteScanner from './pages/WasteScanner';
import AiLab from './pages/AiLab';

const NavBar = () => {
  const { language, setLanguage, translate } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to={user ? "/projects" : "/"} className="logo">EDUBUILD</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {user ? (
            <>
              <Link to="/projects" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>{translate('nav.library')}</Link>
              <Link to="/ailab" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>🤖 AI Assistant</Link>
              <Link to="/submit" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>{translate('nav.community')}</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>{translate('nav.admin')}</Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', padding: '5px 12px', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: 14 }}>🌐</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="tel">TE</option>
                </select>
              </div>
              <button onClick={logout} style={{ background: 'var(--primary)', border: 'none', color: 'black', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{translate('nav.logout')}</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/signin" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>{translate('nav.login')}</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>{translate('nav.signup')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/edit-project/:id" element={<AdminRoute><EditProject /></AdminRoute>} />
                <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
                <Route path="/project/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
                <Route path="/submit" element={<PrivateRoute><SubmitProject /></PrivateRoute>} />
                <Route path="/" element={<Home />} />
                <Route path="/scanner" element={<PrivateRoute><WasteScanner /></PrivateRoute>} />
                <Route path="/ailab" element={<PrivateRoute><AiLab /></PrivateRoute>} />

              </Routes>
            </main>
            <footer style={{ padding: 40, textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: 80, color: 'var(--text-muted)' }}>
              <p>© 2026 EDUBUILD — Innovative STEM for All</p>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
