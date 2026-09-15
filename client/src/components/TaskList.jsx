import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Check, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

const TaskList = () => {
  const { tasks, toggleTaskStatus, moveTaskStatus, setSelectedTask } = useTasks();

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={32} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
        <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>No tasks found</h4>
        <p style={{ fontSize: '0.82rem' }}>Adjust your filters or add a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="real-table-wrap">
        <table className="real-table" aria-label="Tasks List Table">
          <thead>
            <tr>
              <th style={{ width: '36px' }}></th>
              <th>Task</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Subtasks</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isCompleted = task.status === 'Completed';
              const subtasks = task.subtasks || [];
              const completedSubtasks = subtasks.filter((st) => st.completed).length;
              const dueDate = task.dueDate ? new Date(task.dueDate) : null;
              const isOverdue = !isCompleted && dueDate && dueDate < new Date();

              return (
                <tr key={task._id} onClick={() => setSelectedTask(task)}>
                  {/* Status Circle */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className={`status-circle-check ${isCompleted ? 'checked' : ''}`}
                      onClick={() => toggleTaskStatus(task)}
                      aria-label="Toggle task completed"
                    >
                      {isCompleted && <Check size={10} strokeWidth={3} />}
                    </button>
                  </td>

                  {/* Title */}
                  <td>
                    <span
                      style={{
                        fontWeight: 500,
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </span>
                  </td>

                  {/* Priority */}
                  <td>
                    <span className={`priority-flag ${task.priority}`}>
                      {task.priority === 'Urgent' ? '🔥 Urgent' : task.priority}
                    </span>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-chip">{task.category || 'General'}</span>
                  </td>

                  {/* Subtasks */}
                  <td>
                    {subtasks.length > 0 ? (
                      <span className="subtask-count-chip">
                        <CheckSquare size={12} />
                        <span>{completedSubtasks}/{subtasks.length}</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&mdash;</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td>
                    {dueDate ? (
                      <span
                        className={`due-date-chip ${isOverdue ? 'overdue' : ''}`}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <Calendar size={12} />
                        <span>{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&mdash;</span>
                    )}
                  </td>

                  {/* Status Selector */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="meta-value-select"
                      style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                      value={task.status}
                      onChange={(e) => moveTaskStatus(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
