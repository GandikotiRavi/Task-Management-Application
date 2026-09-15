import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Layers, Clock, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

const TaskStats = () => {
  const { stats, setFilterStatus } = useTasks();

  return (
    <section aria-label="Task Analytics and Statistics">
      {/* 5 KPI Metric Cards */}
      <div className="stats-grid">
        <div
          className="stat-card total"
          onClick={() => setFilterStatus('All')}
          style={{ cursor: 'pointer' }}
          title="Click to view all tasks"
        >
          <div className="stat-icon-wrapper">
            <Layers size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div
          className="stat-card progress"
          onClick={() => setFilterStatus('In Progress')}
          style={{ cursor: 'pointer' }}
          title="Click to view in-progress tasks"
        >
          <div className="stat-icon-wrapper">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div
          className="stat-card completed"
          onClick={() => setFilterStatus('Completed')}
          style={{ cursor: 'pointer' }}
          title="Click to view completed tasks"
        >
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div
          className="stat-card pending"
          onClick={() => setFilterStatus('Pending')}
          style={{ cursor: 'pointer' }}
          title="Click to view pending tasks"
        >
          <div className="stat-icon-wrapper">
            <AlertCircle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div
          className="stat-card overdue"
          onClick={() => setFilterStatus('All')}
          style={{ cursor: 'pointer' }}
          title="Tasks overdue"
        >
          <div className="stat-icon-wrapper">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Interactive Completion Rate Progress Card */}
      <div className="progress-card">
        <div className="progress-header">
          <span>Overall Completion Velocity</span>
          <span className="progress-rate">{stats.completionRate}% Done</span>
        </div>
        <div className="progress-bar-container" role="progressbar" aria-valuenow={stats.completionRate} aria-valuemin="0" aria-valuemax="100">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default TaskStats;
