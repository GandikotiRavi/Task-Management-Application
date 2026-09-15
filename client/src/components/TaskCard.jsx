import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Check, Calendar, CheckSquare } from 'lucide-react';

const TaskCard = ({ task, onDragStart }) => {
  const { toggleTaskStatus, setSelectedTask } = useTasks();

  const isCompleted = task.status === 'Completed';

  // Subtasks progress
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((st) => st.completed).length;

  // Due date formatting
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = !isCompleted && date < now;

    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return { formatted, isOverdue };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <article
      className={`real-task-card ${isCompleted ? 'is-done' : ''}`}
      onClick={() => setSelectedTask(task)}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task._id)}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
    >
      <div className="card-top-row">
        {/* Status completion circle */}
        <button
          type="button"
          className={`status-circle-check ${isCompleted ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task);
          }}
          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          aria-label="Toggle task completed"
        >
          {isCompleted && <Check size={10} strokeWidth={3} />}
        </button>

        <span className="card-main-title">{task.title}</span>

        <span className={`priority-flag ${task.priority}`}>
          {task.priority === 'Urgent' ? '🔥 Urgent' : task.priority}
        </span>
      </div>

      {task.description && (
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.35',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            paddingLeft: '26px'
          }}
        >
          {task.description}
        </p>
      )}

      {/* Metadata Bottom Row */}
      <div className="card-bottom-row" style={{ paddingLeft: '26px' }}>
        <div className="card-chips-left">
          {task.category && (
            <span className="category-chip">{task.category}</span>
          )}

          {subtasks.length > 0 && (
            <span className={`subtask-count-chip ${completedSubtasks === subtasks.length ? 'complete' : ''}`}>
              <CheckSquare size={11} />
              <span>{completedSubtasks}/{subtasks.length}</span>
            </span>
          )}

          {dueInfo && (
            <span className={`due-date-chip ${dueInfo.isOverdue ? 'overdue' : ''}`}>
              <Calendar size={11} />
              <span>{dueInfo.formatted}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '0.65rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Assigned to Alex Johnson"
        >
          AJ
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
