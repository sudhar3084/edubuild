import React, { useState, useContext } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/signin', { email, password })
      login(res.data)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 450 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 15 }}>👋</div>
          <h2 style={{ fontSize: '2rem', marginBottom: 10 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to your EDUBUILD dashboard.</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              placeholder="teacher@school.org"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ padding: 14, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Password</label>
              <span style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer' }}>Forgot?</span>
            </div>
            <input
              placeholder="••••••••" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ padding: 14, borderRadius: 12, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 16, marginTop: 10, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: 10, paddingTop: 20 }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              New to EDUBUILD? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Create an Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
