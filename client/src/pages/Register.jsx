import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Eye,
  EyeOff,
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

const Register = () => {
  const { register, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
              <span className="tab-title">TaskFlow &bull; Create Account</span>
            </div>
          </div>

          <div className="browser-window-meta">
            <span className="browser-brand-tag">TaskFlow Browser Edition</span>
          </div>
        </div>

        <div className="browser-nav-bar">
          <div className="browser-nav-buttons">
            <button type="button" className="browser-icon-btn" onClick={() => navigate('/login')}><ArrowLeft size={16} /></button>
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
              <span className="omnibox-path">/auth/register</span>
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join TaskFlow to organize your engineering sprints</p>
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
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="At least 6 characters"
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
              id="register-submit-btn"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
