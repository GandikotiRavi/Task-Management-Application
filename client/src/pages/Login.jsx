import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const res = await demoLogin();
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Demo login failed.');
      }
    } catch (err) {
      setError('Failed to connect to demo account.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-wrapper" style={{ width: '48px', height: '48px' }}>
            <CheckSquare size={28} strokeWidth={2.4} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your tasks, sprints, and priorities</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="demo-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#6366f1" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Instant Demo Experience</span>
          </div>
          <p className="demo-box-text">Explore all features instantly with sample tasks and analytics.</p>
          <button
            type="button"
            className="btn btn-secondary"
            id="demo-login-btn"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {demoLoading ? 'Accessing Demo...' : 'Try Demo Account (1-Click)'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="action-icon-btn"
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            id="login-submit-btn"
            disabled={loading || demoLoading}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
