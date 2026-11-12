import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, TrendingUp } from 'lucide-react';

const ProjectHero = () => {
  const { stats } = useTasks();

  return (
    <section className="project-banner" aria-label="Project Overview">
      <div className="project-banner-top">
        <div className="project-title-area">
          <div className="project-tag-eyebrow">
            <Sparkles size={13} color="var(--accent)" />
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
            <div className="avatar-stack-item" style={{ background: '#2563eb' }}>AJ</div>
            <div className="avatar-stack-item" style={{ background: '#06b6d4' }}>SC</div>
            <div className="avatar-stack-item" style={{ background: '#ec4899' }}>ML</div>
            <div className="avatar-stack-item" style={{ background: '#f59e0b', fontSize: '0.65rem' }}>+3</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
