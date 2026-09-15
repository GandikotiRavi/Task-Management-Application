import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  Kanban,
  ListFilter,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Plus,
  LogOut,
  ChevronDown,
  Hash
} from 'lucide-react';

const Sidebar = ({ onOpenNewTask, isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const {
    viewMode,
    changeViewMode,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    stats
  } = useTasks();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const categories = [
    { name: 'All', label: 'All Projects', color: '#6366f1' },
    { name: 'Frontend', label: 'Frontend', color: '#06b6d4' },
    { name: 'Backend', label: 'Backend', color: '#a855f7' },
    { name: 'Architecture', label: 'Architecture', color: '#f59e0b' },
    { name: 'Design', label: 'Design', color: '#ec4899' },
    { name: 'Testing', label: 'Testing', color: '#10b981' }
  ];

  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''}`} aria-label="Sidebar Navigation">
      {/* Workspace Selector */}
      <div className="sidebar-header">
        <div className="workspace-dropdown" title="Current Workspace">
          <div className="workspace-badge">TF</div>
          <div className="workspace-meta">
            <span className="workspace-name">TaskFlow Workspace</span>
            <span className="workspace-plan">Pro Team &bull; Sprint 14</span>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>

      {/* New Task Action */}
      <div className="sidebar-action-wrap">
        <button
          onClick={onOpenNewTask}
          className="btn-sidebar-new"
          id="sidebar-new-task-btn"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-content">
        {/* Core Views */}
        <div className="nav-section">
          <div className="nav-section-title">Views</div>

          <button
            onClick={() => {
              changeViewMode('kanban');
              setFilterStatus('All');
              setFilterPriority('All');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-link ${viewMode === 'kanban' && filterStatus === 'All' && filterPriority === 'All' ? 'active' : ''}`}
          >
            <div className="link-left">
              <Kanban size={16} />
              <span>Board</span>
            </div>
            <span className="link-badge">{stats.total}</span>
          </button>

          <button
            onClick={() => {
              changeViewMode('list');
              setFilterStatus('All');
              setFilterPriority('All');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-link ${viewMode === 'list' && filterStatus === 'All' && filterPriority === 'All' ? 'active' : ''}`}
          >
            <div className="link-left">
              <ListFilter size={16} />
              <span>List</span>
            </div>
            <span className="link-badge">{stats.total}</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="nav-section">
          <div className="nav-section-title">Workflow</div>

          <button
            onClick={() => {
              setFilterStatus('In Progress');
              setFilterPriority('All');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-link ${filterStatus === 'In Progress' ? 'active' : ''}`}
          >
            <div className="link-left">
              <Clock size={16} color="var(--status-in-progress)" />
              <span>In Progress</span>
            </div>
            <span className="link-badge">{stats.inProgress}</span>
          </button>

          <button
            onClick={() => {
              setFilterStatus('Completed');
              setFilterPriority('All');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-link ${filterStatus === 'Completed' ? 'active' : ''}`}
          >
            <div className="link-left">
              <CheckCircle2 size={16} color="var(--status-completed)" />
              <span>Completed</span>
            </div>
            <span className="link-badge">{stats.completed}</span>
          </button>

          <button
            onClick={() => {
              setFilterPriority('Urgent');
              setFilterStatus('All');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-link ${filterPriority === 'Urgent' ? 'active' : ''}`}
          >
            <div className="link-left">
              <Flame size={16} color="var(--priority-urgent)" />
              <span>Urgent Priority</span>
            </div>
          </button>
        </div>

        {/* Projects / Categories */}
        <div className="nav-section">
          <div className="nav-section-title">Projects & Tags</div>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setFilterCategory(cat.name);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`sidebar-link ${filterCategory === cat.name ? 'active' : ''}`}
            >
              <div className="link-left">
                <span className="category-dot" style={{ background: cat.color }} />
                <span>{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar-circle">
            {getInitials(user?.name)}
            <span className="online-dot" />
          </div>
          <div className="user-text">
            <span className="user-display-name">{user?.name || 'Workspace User'}</span>
            <span className="user-role">{user?.email || 'Active Member'}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn-icon"
          title="Sign out of TaskFlow"
          aria-label="Sign out"
          style={{ border: 'none' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
