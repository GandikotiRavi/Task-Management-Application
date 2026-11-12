import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Search,
  Star,
  Share2,
  Shield,
  Plus,
  Sun,
  Moon,
  Sparkles,
  X,
  Kanban,
  ListFilter,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const BrowserHeader = ({ onOpenNewTask }) => {
  const { user, logout, theme, toggleTheme, isOffline } = useAuth();
  const {
    tasks,
    allTasks,
    stats,
    activeBrowserTab,
    setActiveBrowserTab,
    viewMode,
    changeViewMode,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    fetchTasks,
    triggerConfetti,
    addToast
  } = useTasks();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus address/search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsSecurityModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle reload button click
  const handleReload = async () => {
    setIsRefreshing(true);
    await fetchTasks();
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Browser tab reloaded & synchronized', 'info');
    }, 600);
  };

  // Handle copy / share link
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    addToast('Workspace URL copied to clipboard!', 'success');
  };

  // Compute dynamic Omnibox URL
  const getDynamicURL = () => {
    let path = 'https://taskflow.internal.net/sprint-14';
    const params = [];
    if (activeBrowserTab !== 'board') params.push(`tab=${activeBrowserTab}`);
    if (viewMode !== 'kanban') params.push(`view=${viewMode}`);
    if (filterStatus !== 'All') params.push(`status=${filterStatus}`);
    if (filterPriority !== 'All') params.push(`priority=${filterPriority}`);
    if (filterCategory !== 'All') params.push(`category=${filterCategory}`);
    if (searchQuery.trim()) params.push(`q=${encodeURIComponent(searchQuery.trim())}`);
    return params.length > 0 ? `${path}?${params.join('&')}` : path;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="browser-chrome-header" role="banner">
      {/* 1. OFFICIAL BROWSER TAB BAR & WINDOW CONTROLS */}
      <div className="browser-tab-bar">
        {/* Window Controls (Mac Style Traffic Lights) */}
        <div className="browser-window-controls" aria-label="Window Controls">
          <span className="window-dot dot-close" title="Close Window" />
          <span className="window-dot dot-minimize" title="Minimize Window" />
          <span className="window-dot dot-maximize" title="Maximize Window" />
        </div>

        {/* Browser Tabs Row */}
        <div className="browser-tabs-track" role="tablist">
          {/* Tab 1: Kanban Board */}
          <button
            type="button"
            role="tab"
            aria-selected={activeBrowserTab === 'board'}
            className={`browser-tab ${activeBrowserTab === 'board' ? 'active' : ''}`}
            onClick={() => {
              setActiveBrowserTab('board');
              changeViewMode('kanban');
            }}
          >
            <div className="tab-favicon">
              <Kanban size={13} color="var(--primary)" />
            </div>
            <span className="tab-title">TaskFlow &bull; Kanban Board</span>
            <span className="tab-badge">{stats.total}</span>
            <span
              className="tab-close-btn"
              title="Reset View"
              onClick={(e) => {
                e.stopPropagation();
                setFilterStatus('All');
                setFilterPriority('All');
                setSearchQuery('');
              }}
            >
              &times;
            </span>
          </button>

          {/* Tab 2: Table List View */}
          <button
            type="button"
            role="tab"
            aria-selected={activeBrowserTab === 'list'}
            className={`browser-tab ${activeBrowserTab === 'list' ? 'active' : ''}`}
            onClick={() => {
              setActiveBrowserTab('list');
              changeViewMode('list');
            }}
          >
            <div className="tab-favicon">
              <ListFilter size={13} color="#06b6d4" />
            </div>
            <span className="tab-title">Tasks Table List</span>
            <span
              className="tab-close-btn"
              title="Close Tab"
              onClick={(e) => {
                e.stopPropagation();
                setActiveBrowserTab('board');
              }}
            >
              &times;
            </span>
          </button>

          {/* Tab 3: Sprint Analytics Dashboard */}
          <button
            type="button"
            role="tab"
            aria-selected={activeBrowserTab === 'analytics'}
            className={`browser-tab ${activeBrowserTab === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setActiveBrowserTab('analytics');
            }}
          >
            <div className="tab-favicon">
              <BarChart3 size={13} color="#10b981" />
            </div>
            <span className="tab-title">Sprint Analytics &amp; Velocity</span>
            <span
              className="tab-close-btn"
              title="Close Tab"
              onClick={(e) => {
                e.stopPropagation();
                setActiveBrowserTab('board');
              }}
            >
              &times;
            </span>
          </button>

          {/* Tab 4: Urgent & Priorities */}
          <button
            type="button"
            role="tab"
            aria-selected={activeBrowserTab === 'urgent'}
            className={`browser-tab ${activeBrowserTab === 'urgent' ? 'active' : ''}`}
            onClick={() => {
              setActiveBrowserTab('urgent');
              setFilterPriority('Urgent');
              changeViewMode('kanban');
            }}
          >
            <div className="tab-favicon">
              <Flame size={13} color="var(--priority-urgent)" />
            </div>
            <span className="tab-title">Urgent Tasks</span>
            <span className="tab-badge urgent">{allTasks.filter((t) => t.priority === 'Urgent').length}</span>
            <span
              className="tab-close-btn"
              title="Close Tab"
              onClick={(e) => {
                e.stopPropagation();
                setFilterPriority('All');
                setActiveBrowserTab('board');
              }}
            >
              &times;
            </span>
          </button>

          {/* New Tab Button */}
          <button
            type="button"
            className="browser-new-tab-btn"
            title="Open New Task"
            onClick={onOpenNewTask}
            aria-label="New Task in New Tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Windows-style controls toggle */}
        <div className="browser-window-meta">
          <span className="browser-brand-tag">TaskFlow Browser Edition</span>
        </div>
      </div>

      {/* 2. OFFICIAL BROWSER NAVIGATION BAR & OMNIBOX */}
      <div className="browser-nav-bar">
        {/* Navigation Buttons: Back, Forward, Reload, Home */}
        <div className="browser-nav-buttons">
          <button
            type="button"
            className="browser-icon-btn"
            title="Back to Board"
            onClick={() => {
              setActiveBrowserTab('board');
              changeViewMode('kanban');
              setFilterStatus('All');
            }}
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            type="button"
            className="browser-icon-btn"
            title="Forward to Analytics"
            onClick={() => setActiveBrowserTab('analytics')}
            aria-label="Forward"
          >
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className={`browser-icon-btn ${isRefreshing ? 'spin-anim' : ''}`}
            title="Reload Workspace Tasks"
            onClick={handleReload}
            aria-label="Reload"
          >
            <RotateCw size={15} />
          </button>

          <button
            type="button"
            className="browser-icon-btn"
            title="Workspace Home (Clear all filters)"
            onClick={() => {
              setActiveBrowserTab('board');
              changeViewMode('kanban');
              setFilterStatus('All');
              setFilterPriority('All');
              setFilterCategory('All');
              setSearchQuery('');
            }}
            aria-label="Home"
          >
            <Home size={15} />
          </button>
        </div>

        {/* The Official Browser Omnibox (Address & Live Search Bar) */}
        <div className="browser-omnibox-wrapper">
          <div
            className="omnibox-security-badge"
            title="Connection is Secure (TLS 1.3 Encryption • Zero-Knowledge)"
            onClick={() => setIsSecurityModalOpen(!isSecurityModalOpen)}
          >
            <Lock size={13} className="omnibox-lock-icon" />
          </div>

          <div className="omnibox-address-text" title={getDynamicURL()}>
            <span className="omnibox-protocol">https://</span>
            <span className="omnibox-domain">taskflow.internal.net</span>
            <span className="omnibox-path">/sprint-14</span>
          </div>

          <div className="omnibox-divider" />

          {/* Integrated Real-time Task Search Input */}
          <div className="omnibox-search-box">
            <Search size={14} className="omnibox-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="omnibox-search-input"
              placeholder="Search tasks, descriptions, subtasks... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks in Omnibox"
            />
            {searchQuery ? (
              <button
                type="button"
                className="omnibox-clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="omnibox-kbd-hint">Ctrl K</span>
            )}
          </div>

          {/* Right Omnibox Controls: Bookmark, Share, Shield */}
          <div className="omnibox-actions">
            <button
              type="button"
              className={`omnibox-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
              title={isBookmarked ? 'Workspace Bookmarked' : 'Bookmark this view'}
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                addToast(isBookmarked ? 'Bookmark removed' : 'View saved to bookmarks bar!', 'info');
              }}
            >
              <Star size={14} fill={isBookmarked ? '#f59e0b' : 'none'} color={isBookmarked ? '#f59e0b' : 'currentColor'} />
            </button>

            <button
              type="button"
              className="omnibox-action-btn"
              title="Share Workspace Link"
              onClick={handleShare}
            >
              <Share2 size={14} />
            </button>

            <button
              type="button"
              className="omnibox-action-btn"
              title="Privacy & Real-time State Guard: Active"
            >
              <Shield size={14} color="#10b981" />
            </button>
          </div>
        </div>

        {/* 3. BROWSER EXTENSIONS & USER PROFILE */}
        <div className="browser-extensions-bar">
          {/* Real-time Socket / Local Sync Indicator */}
          <div
            className={`browser-sync-pill ${isOffline ? 'offline' : 'online'}`}
            title={isOffline ? 'Local Storage Engine Active (100% Offline-Safe)' : 'Real-time WebSocket Live Sync Active'}
          >
            <span className="sync-pulse-dot" />
            <span className="sync-text">{isOffline ? 'Local Store' : 'Live Sync'}</span>
          </div>

          {/* Confetti Cannon Extension */}
          <button
            type="button"
            className="browser-icon-btn confetti-btn"
            title="Celebrate Sprint Progress (Confetti Cannon)"
            onClick={() => {
              triggerConfetti();
              addToast('🎉 Sprint cheer unlocked!', 'success');
            }}
            aria-label="Trigger Confetti"
          >
            <Sparkles size={16} color="var(--primary)" />
          </button>

          {/* Quick Add Task Button */}
          <button
            type="button"
            className="btn btn-primary browser-quick-add"
            onClick={onOpenNewTask}
            id="browser-new-task-btn"
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            className="browser-icon-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="browser-profile-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className="browser-avatar-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Open User Menu"
            >
              <div className="browser-avatar">{getInitials(user?.name)}</div>
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {isProfileMenuOpen && (
              <div className="browser-profile-dropdown" role="menu">
                <div className="profile-dropdown-header">
                  <div className="profile-name">{user?.name || 'Workspace User'}</div>
                  <div className="profile-email">{user?.email || 'demo@taskflow.dev'}</div>
                  <div className="profile-role-badge">
                    {user?.role || 'Sprint Lead'} &bull; {isOffline ? 'Offline Mode' : 'Online'}
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <div className="profile-stats-summary">
                  <div className="p-stat">
                    <span>Total Tasks</span>
                    <strong>{stats.total}</strong>
                  </div>
                  <div className="p-stat">
                    <span>Completed</span>
                    <strong style={{ color: 'var(--status-completed)' }}>{stats.completed}</strong>
                  </div>
                  <div className="p-stat">
                    <span>Velocity</span>
                    <strong style={{ color: 'var(--primary)' }}>{stats.completionRate}%</strong>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => {
                    setActiveBrowserTab('analytics');
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <BarChart3 size={15} />
                  <span>View Velocity Report</span>
                </button>

                <button
                  type="button"
                  className="profile-dropdown-item danger"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL BROWSER BOOKMARKS / FAVORITES TOOLBAR */}
      <div className="browser-bookmarks-bar" role="toolbar" aria-label="Browser Bookmarks">
        <span className="bookmarks-label">Bookmarks:</span>

        {/* All Tasks Bookmark */}
        <button
          type="button"
          className={`bookmark-chip ${filterStatus === 'All' && filterPriority === 'All' && filterCategory === 'All' ? 'active' : ''}`}
          onClick={() => {
            setActiveBrowserTab('board');
            setFilterStatus('All');
            setFilterPriority('All');
            setFilterCategory('All');
          }}
        >
          <Star size={12} fill="currentColor" color="#f59e0b" />
          <span>All Tasks</span>
          <span className="bookmark-count">{allTasks.length}</span>
        </button>

        {/* Urgent Bookmark */}
        <button
          type="button"
          className={`bookmark-chip ${filterPriority === 'Urgent' ? 'active' : ''}`}
          onClick={() => {
            setActiveBrowserTab('board');
            setFilterPriority(filterPriority === 'Urgent' ? 'All' : 'Urgent');
          }}
        >
          <Flame size={12} color="var(--priority-urgent)" />
          <span>Urgent</span>
          <span className="bookmark-count urgent">
            {allTasks.filter((t) => t.priority === 'Urgent').length}
          </span>
        </button>

        {/* In Progress Bookmark */}
        <button
          type="button"
          className={`bookmark-chip ${filterStatus === 'In Progress' ? 'active' : ''}`}
          onClick={() => {
            setActiveBrowserTab('board');
            setFilterStatus(filterStatus === 'In Progress' ? 'All' : 'In Progress');
          }}
        >
          <Clock size={12} color="var(--status-in-progress)" />
          <span>In Progress</span>
          <span className="bookmark-count">{stats.inProgress}</span>
        </button>

        {/* Completed Bookmark */}
        <button
          type="button"
          className={`bookmark-chip ${filterStatus === 'Completed' ? 'active' : ''}`}
          onClick={() => {
            setActiveBrowserTab('board');
            setFilterStatus(filterStatus === 'Completed' ? 'All' : 'Completed');
          }}
        >
          <CheckCircle2 size={12} color="var(--status-completed)" />
          <span>Completed</span>
          <span className="bookmark-count">{stats.completed}</span>
        </button>

        <div className="bookmarks-separator" />

        {/* Category Bookmarks */}
        {['Frontend', 'Backend', 'Architecture', 'Design', 'Testing'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`bookmark-chip category ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveBrowserTab('board');
              setFilterCategory(filterCategory === cat ? 'All' : cat);
            }}
          >
            <span>🏷️ {cat}</span>
          </button>
        ))}

        <div className="bookmarks-separator" />

        {/* Analytics Report Bookmark */}
        <button
          type="button"
          className={`bookmark-chip analytics ${activeBrowserTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveBrowserTab('analytics')}
        >
          <BarChart3 size={12} color="#10b981" />
          <span>Sprint Analytics Report</span>
        </button>
      </div>
    </header>
  );
};

export default BrowserHeader;
