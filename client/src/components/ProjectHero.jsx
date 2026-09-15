import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Kanban, ListFilter, Sparkles, Filter } from 'lucide-react';

const ProjectHero = () => {
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

  return (
    <section className="project-banner" aria-label="Project Overview">
      <div className="project-banner-top">
        <div className="project-title-area">
          <div className="project-tag-eyebrow">
            <Sparkles size={13} />
            <span>Active Sprint &bull; Target: Sep 30</span>
          </div>
          <h1 className="project-title">Sprint 14: Engineering Workspace</h1>
          <p className="project-desc">
            Productivity tracking, drag-and-drop workflow, real-time WebSocket state, and subtasks.
          </p>
        </div>

        {/* Team Avatars & Sprint Progress Summary */}
        <div className="project-team-stack">
          <div className="sprint-stats-summary">
            <div className="sprint-stat-item">
              <span>Total:</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="sprint-stat-item">
              <span>In Progress:</span>
              <strong style={{ color: 'var(--status-in-progress)' }}>{stats.inProgress}</strong>
            </div>
            <div className="sprint-stat-item">
              <span>Completed:</span>
              <strong style={{ color: 'var(--status-completed)' }}>{stats.completed}</strong>
            </div>
            <div className="sprint-stat-item">
              <span>Velocity:</span>
              <strong style={{ color: 'var(--accent)' }}>{stats.completionRate}%</strong>
            </div>
          </div>

          <div className="avatar-stack" title="Team members on this sprint">
            <div className="avatar-stack-item" style={{ background: '#6366f1' }}>AJ</div>
            <div className="avatar-stack-item" style={{ background: '#06b6d4' }}>SC</div>
            <div className="avatar-stack-item" style={{ background: '#ec4899' }}>ML</div>
            <div className="avatar-stack-item" style={{ background: '#f59e0b', fontSize: '0.65rem' }}>+3</div>
          </div>
        </div>
      </div>

      {/* Views & Quick Filters Bar */}
      <div className="view-filter-bar">
        <div className="view-tabs" role="tablist" aria-label="View Modes">
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => changeViewMode('kanban')}
            role="tab"
            aria-selected={viewMode === 'kanban'}
          >
            <Kanban size={15} />
            <span>Board</span>
          </button>

          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => changeViewMode('list')}
            role="tab"
            aria-selected={viewMode === 'list'}
          >
            <ListFilter size={15} />
            <span>List</span>
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="quick-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filterStatus === 'All' && filterPriority === 'All' && filterCategory === 'All' ? 'active' : ''}`}
            onClick={() => {
              setFilterStatus('All');
              setFilterPriority('All');
              setFilterCategory('All');
            }}
          >
            All Tasks
          </button>

          <button
            type="button"
            className={`filter-chip ${filterStatus === 'In Progress' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'In Progress' ? 'All' : 'In Progress')}
          >
            ⚡ In Progress ({stats.inProgress})
          </button>

          <button
            type="button"
            className={`filter-chip ${filterPriority === 'Urgent' ? 'active' : ''}`}
            onClick={() => setFilterPriority(filterPriority === 'Urgent' ? 'All' : 'Urgent')}
          >
            🔥 Urgent
          </button>

          <button
            type="button"
            className={`filter-chip ${filterStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'Completed' ? 'All' : 'Completed')}
          >
            ✓ Completed ({stats.completed})
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
