import React, { useState, useContext } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    adminSecret: '',
    school: '',
    state: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        school: form.school,
        state: form.state
      }
      if (form.role === 'admin') payload.adminSecret = form.adminSecret

      const res = await api.post('/auth/signup', payload)
      login(res.data)
      navigate(form.role === 'admin' ? '/admin' : '/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '40px 20px' }}>
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 550 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 10 }}>Join Edubuild</h2>
          <p style={{ color: 'var(--text-muted)' }}>Empowering students and teachers with STEM innovation.</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Full Name</label>
              <input
                name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Email Address</label>
              <input
                name="email" placeholder="teacher@school.org" type="email"
                value={form.email} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>School Name</label>
              <input
                name="school" placeholder="Govt. High School"
                value={form.school} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>State</label>
              <input
                name="state" placeholder="Andhra Pradesh"
                value={form.state} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Password</label>
              <input
                name="password" placeholder="••••••••" type="password"
                value={form.password} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Confirm Password</label>
              <input
                name="confirmPassword" placeholder="••••••••" type="password"
                value={form.confirmPassword} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'var(--background)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: 10, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" name="role" value="student" checked={form.role === 'student'} onChange={handleChange} />
              <span>Student</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
              <span>Admin</span>
            </label>
          </div>

          {form.role === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animate: 'fade' }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>Admin Secret Key</label>
              <input
                name="adminSecret" placeholder="Enter special key to get admin access"
                value={form.adminSecret} onChange={handleChange} required
                style={{ padding: 12, borderRadius: 10, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', color: 'white' }}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 16, marginTop: 10, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>
            Already have an account? <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
