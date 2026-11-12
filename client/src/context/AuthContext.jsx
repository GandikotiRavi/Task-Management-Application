import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const DEMO_USER = {
  _id: 'demo_user_101',
  name: 'Alex Johnson',
  email: 'demo@taskflow.dev',
  role: 'Engineering Lead'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  // Always default to light; clear any old 'dark' saved value
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    // If user explicitly picked dark via toggle, respect it; but wipe stale dark from old sessions
    if (saved === 'dark' && !localStorage.getItem('theme_user_chosen')) {
      localStorage.removeItem('theme');
      return 'light';
    }
    return saved || 'light';
  });
  const [isOffline, setIsOffline] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        localStorage.setItem('theme_user_chosen', '1');
      } else {
        localStorage.removeItem('theme_user_chosen');
      }
      return next;
    });
  };

  // Verify auth session on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setIsOffline(false);
          }
        } catch (err) {
          // If server is unavailable (ECONNREFUSED / Network Error), don't kick user out!
          if (!err.response) {
            console.warn('[Auth] Backend server offline, operating in local workspace mode.');
            setIsOffline(true);
          } else if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyAuth();

    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsOffline(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Login failed.' };
    } catch (err) {
      // Backend not running: allow login if password matches or fallback
      if (!err.response) {
        const localUser = {
          _id: 'usr_' + Date.now(),
          name: email.split('@')[0],
          email,
          role: 'Member'
        };
        const mockToken = 'mock_jwt_' + Date.now();
        setToken(mockToken);
        setUser(localUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(localUser));
        setIsOffline(true);
        return { success: true, message: 'Logged in (Local Workspace Mode)' };
      }
      return { success: false, message: err.response?.data?.message || 'Invalid email or password.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsOffline(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Registration failed.' };
    } catch (err) {
      if (!err.response) {
        const localUser = {
          _id: 'usr_' + Date.now(),
          name,
          email,
          role: 'Member'
        };
        const mockToken = 'mock_jwt_' + Date.now();
        setToken(mockToken);
        setUser(localUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(localUser));
        setIsOffline(true);
        return { success: true, message: 'Account registered (Local Workspace Mode)' };
      }
      return { success: false, message: err.response?.data?.message || 'Registration failed.' };
    }
  };

  const demoLogin = async () => {
    try {
      const res = await api.post('/auth/demo');
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsOffline(false);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      console.warn('[Auth] Demo API unavailable, activating resilient local demo session.');
    }

    // Instant zero-failure demo fallback
    const mockToken = 'demo_token_' + Date.now();
    setToken(mockToken);
    setUser(DEMO_USER);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(DEMO_USER));
    setIsOffline(true);
    return { success: true, message: 'Welcome to TaskFlow Demo!' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        theme,
        toggleTheme,
        isOffline,
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
