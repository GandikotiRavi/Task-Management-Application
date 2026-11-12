import React from 'react';
import { useTasks } from '../context/TaskContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Layers,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const AnalyticsView = () => {
  const { allTasks, stats, setSelectedTask, setActiveBrowserTab, changeViewMode } = useTasks();

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'Completed').length;
  const inProgress = allTasks.filter((t) => t.status === 'In Progress').length;
  const pending = allTasks.filter((t) => t.status === 'Pending').length;
  const urgent = allTasks.filter((t) => t.priority === 'Urgent').length;
  const high = allTasks.filter((t) => t.priority === 'High').length;
  const medium = allTasks.filter((t) => t.priority === 'Medium').length;
  const low = allTasks.filter((t) => t.priority === 'Low').length;

  const now = new Date();
  const overdueTasks = allTasks.filter((t) => {
    if (t.status === 'Completed' || !t.dueDate) return false;
    return new Date(t.dueDate) < now;
  });

  // Category breakdown
  const categoryMap = {};
  allTasks.forEach((t) => {
    const cat = t.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
    percent: total > 0 ? Math.round((count / total) * 100) : 0
  }));

  const categoryColors = {
    Frontend: '#06b6d4',
    Backend: '#a855f7',
    Architecture: '#f59e0b',
    Design: '#ec4899',
    Testing: '#10b981',
    General: '#6366f1'
  };

  return (
    <div className="analytics-view-container">
      {/* Analytics Hero Banner */}
      <div className="analytics-hero">
        <div className="analytics-hero-left">
          <div className="analytics-eyebrow">
            <Sparkles size={14} color="#6366f1" />
            <span>Sprint 14 Performance &bull; Official Analytics Report</span>
          </div>
          <h2 className="analytics-title">Engineering Velocity &amp; Task Health</h2>
          <p className="analytics-subtitle">
            Real-time telemetry, completion cadence, priority distribution, and milestone tracking.
          </p>
        </div>

        <div className="velocity-gauge-card">
          <div className="velocity-gauge-header">
            <span>Sprint Velocity</span>
            <TrendingUp size={16} color="var(--primary)" />
          </div>
          <div className="velocity-metric-big">
            <span className="velocity-number">{stats.completionRate}%</span>
            <span className="velocity-sub">Done</span>
          </div>
          <div className="velocity-progress-track">
            <div
              className="velocity-progress-bar"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="velocity-meta">
            <span>{completed} of {total} tasks completed</span>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <Layers size={20} />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{total}</div>
            <div className="kpi-label">Total Sprinted</div>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <Clock size={20} />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{inProgress}</div>
            <div className="kpi-label">Active Work</div>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{completed}</div>
            <div className="kpi-label">Completed</div>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <Flame size={20} />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{urgent}</div>
            <div className="kpi-label">Urgent Priority</div>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <AlertCircle size={20} />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{overdueTasks.length}</div>
            <div className="kpi-label">Overdue Tasks</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Priority Health */}
      <div className="analytics-breakdown-row">
        {/* Categories Breakdown */}
        <div className="analytics-card">
          <div className="card-section-title">
            <span>Work Allocation by Category</span>
            <span className="card-badge">{categories.length} Tags</span>
          </div>

          <div className="category-bars-list">
            {categories.map((cat) => (
              <div key={cat.name} className="category-bar-row">
                <div className="cat-bar-header">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">
                    {cat.count} tasks ({cat.percent}%)
                  </span>
                </div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: categoryColors[cat.name] || '#6366f1'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="analytics-card">
          <div className="card-section-title">
            <span>Task Priority Distribution</span>
            <span className="card-badge">Breakdown</span>
          </div>

          <div className="priority-summary-grid">
            <div className="priority-box urgent">
              <div className="p-box-top">
                <Flame size={16} />
                <span>Urgent</span>
              </div>
              <div className="p-box-val">{urgent}</div>
              <div className="p-box-pct">{total > 0 ? Math.round((urgent / total) * 100) : 0}% of sprint</div>
            </div>

            <div className="priority-box high">
              <div className="p-box-top">
                <span className="dot" />
                <span>High</span>
              </div>
              <div className="p-box-val">{high}</div>
              <div className="p-box-pct">{total > 0 ? Math.round((high / total) * 100) : 0}% of sprint</div>
            </div>

            <div className="priority-box medium">
              <div className="p-box-top">
                <span className="dot" />
                <span>Medium</span>
              </div>
              <div className="p-box-val">{medium}</div>
              <div className="p-box-pct">{total > 0 ? Math.round((medium / total) * 100) : 0}% of sprint</div>
            </div>

            <div className="priority-box low">
              <div className="p-box-top">
                <span className="dot" />
                <span>Low</span>
              </div>
              <div className="p-box-val">{low}</div>
              <div className="p-box-pct">{total > 0 ? Math.round((low / total) * 100) : 0}% of sprint</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Tasks Needing Attention */}
      <div className="analytics-card attention-card">
        <div className="card-section-title">
          <span>Priority Action Items (Urgent &amp; Overdue)</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveBrowserTab('board');
              changeViewMode('kanban');
            }}
          >
            <span>Switch to Kanban Board</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {overdueTasks.length === 0 && urgent === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Award size={28} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <p>All high-priority items are on track! No overdue tasks.</p>
          </div>
        ) : (
          <div className="attention-tasks-list">
            {allTasks
              .filter((t) => t.priority === 'Urgent' || (t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'))
              .map((t) => (
                <div
                  key={t._id}
                  className="attention-task-item"
                  onClick={() => setSelectedTask(t)}
                >
                  <div className="att-left">
                    <span className={`priority-flag ${t.priority}`}>
                      {t.priority === 'Urgent' ? '🔥 Urgent' : t.priority}
                    </span>
                    <span className="att-title">{t.title}</span>
                  </div>
                  <div className="att-right">
                    <span className="category-chip">{t.category}</span>
                    <span className={`col-indicator-pill ${t.status.toLowerCase().replace(' ', '')}`} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.status}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;

