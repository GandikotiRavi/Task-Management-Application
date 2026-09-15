import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Search, Sun, Moon, Plus, Menu, Radio } from 'lucide-react';

const Navbar = ({ onOpenNewTask, onToggleMobileSidebar }) => {
  const { theme, toggleTheme } = useAuth();
  const { searchQuery, setSearchQuery } = useTasks();
  const searchInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="top-app-bar">
      {/* Mobile Toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          className="btn-icon"
          onClick={onToggleMobileSidebar}
          style={{ display: 'none' }}
          id="mobile-sidebar-toggle"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <span>TaskFlow</span>
          <span>/</span>
          <span>Sprints</span>
          <span>/</span>
          <span className="breadcrumb-active">Sprint 14</span>
        </nav>
      </div>

      {/* Global Quick Search Bar */}
      <div className="top-bar-center">
        <Search className="search-icon-left" size={15} />
        <input
          ref={searchInputRef}
          type="text"
          className="quick-search-input"
          placeholder="Search issues, subtasks, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
        />
        <span className="search-shortcut-hint">Ctrl K</span>
      </div>

      {/* Actions */}
      <div className="top-bar-actions">
        {/* Real-time Socket Indicator */}
        <div className="socket-status-pill" title="Real-time WebSockets Active">
          <span className="pulse-circle" />
          <span>Live Sync</span>
        </div>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Create Task Button */}
        <button
          type="button"
          onClick={onOpenNewTask}
          className="btn btn-primary"
          id="nav-new-task-btn"
        >
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
