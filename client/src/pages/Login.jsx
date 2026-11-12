import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Lock,
  RotateCw,
  ArrowLeft,
  ArrowRight as ArrowRightNav,
  Home,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

const Login = () => {
  const { login, demoLogin, theme, toggleTheme } = useAuth();
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
      setError('Login failed. Please check credentials or try Demo.');
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
      setError('Demo activation failed.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="official-browser-frame">
      {/* Official Browser Window Chrome */}
      <div className="browser-chrome-header">
        <div className="browser-tab-bar">
          <div className="browser-window-controls">
            <span className="window-dot dot-close" />
            <span className="window-dot dot-minimize" />
            <span className="window-dot dot-maximize" />
          </div>

          <div className="browser-tabs-track">
            <div className="browser-tab active">
              <div className="tab-favicon">
                <Lock size={13} color="var(--primary)" />
              </div>
              <span className="tab-title">TaskFlow &bull; Secure Authentication</span>
            </div>
          </div>

          <div className="browser-window-meta">
            <span className="browser-brand-tag">TaskFlow Browser Edition</span>
          </div>
        </div>

        <div className="browser-nav-bar">
          <div className="browser-nav-buttons">
            <button type="button" className="browser-icon-btn" disabled><ArrowLeft size={16} /></button>
            <button type="button" className="browser-icon-btn" disabled><ArrowRightNav size={16} /></button>
            <button type="button" className="browser-icon-btn" onClick={() => window.location.reload()}><RotateCw size={15} /></button>
            <button type="button" className="browser-icon-btn" disabled><Home size={15} /></button>
          </div>

          <div className="browser-omnibox-wrapper">
            <div className="omnibox-security-badge" title="Connection is Encrypted and Secure">
              <Lock size={13} className="omnibox-lock-icon" />
            </div>
            <div className="omnibox-address-text">
              <span className="omnibox-protocol">https://</span>
              <span className="omnibox-domain">taskflow.internal.net</span>
              <span className="omnibox-path">/auth/login</span>
            </div>
            <div style={{ flex: 1 }} />
            <div className="omnibox-actions">
              <ShieldCheck size={14} color="#10b981" title="Security Verified" />
            </div>
          </div>

          <div className="browser-extensions-bar">
            <button
              type="button"
              className="browser-icon-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="browser-viewport-content auth-viewport">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-icon-wrapper" style={{ width: '48px', height: '48px' }}>
              <CheckSquare size={28} strokeWidth={2.4} />
            </div>
            <h1 className="auth-title">Welcome to TaskFlow</h1>
            <p className="auth-subtitle">Log in to your workspace or access the instant demo</p>
          </div>

          {/* 1-Click Instant Demo Login Box */}
          <div className="demo-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#6366f1" />
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>1-Click Instant Evaluation</span>
            </div>
            <p className="demo-box-text">Instant access with sample tasks, Kanban workflow, and velocity analytics.</p>
            <button
              type="button"
              className="btn btn-secondary"
              id="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={demoLoading || loading}
              style={{ width: '100%', justifyContent: 'center', fontWeight: 600 }}
            >
              {demoLoading ? 'Starting Workspace...' : 'Launch Instant Demo (1-Click)'}
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
                placeholder="demo@taskflow.dev"
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
    </div>
  );
};

export default Login;
