import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Trash2, Check, Plus } from 'lucide-react';

const TaskDetailDrawer = () => {
  const { selectedTask, setSelectedTask, updateTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
    }
  }, [selectedTask]);

  const handleClose = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedTask(null);
  }, [setSelectedTask]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!selectedTask) return null;

  const subtasks = selectedTask.subtasks || [];
  const completedSubtasks = subtasks.filter((st) => st.completed).length;

  const handleTitleBlur = () => {
    if (title.trim() && title !== selectedTask.title) {
      updateTask(selectedTask._id, { title: title.trim() });
    }
  };

  const handleDescBlur = () => {
    if (description !== selectedTask.description) {
      updateTask(selectedTask._id, { description: description.trim() });
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    addSubtask(selectedTask._id, newSubtaskText.trim());
    setNewSubtaskText('');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${selectedTask.title}"?`)) {
      deleteTask(selectedTask._id);
    }
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Task Details"
    >
      <div className="task-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className={`priority-flag ${selectedTask.priority}`}>
              {selectedTask.priority}
            </span>
            <span className="category-chip">
              {selectedTask.category || 'General'}
            </span>
          </div>

          <div className="drawer-header-right">
            <button
              type="button"
              onClick={handleDelete}
              className="action-icon-btn delete"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="action-icon-btn close-btn"
              title="Close drawer (Esc)"
              aria-label="Close drawer"
              id="drawer-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Editable Title */}
          <input
            type="text"
            className="drawer-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Task title..."
          />

          {/* Properties Grid */}
          <div className="drawer-meta-grid">
            <span className="meta-label">Status</span>
            <select
              className="meta-value-select"
              value={selectedTask.status}
              onChange={(e) => updateTask(selectedTask._id, { status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <span className="meta-label">Priority</span>
            <select
              className="meta-value-select"
              value={selectedTask.priority}
              onChange={(e) => updateTask(selectedTask._id, { priority: e.target.value })}
            >
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚡ High</option>
              <option value="Medium">🔷 Medium</option>
              <option value="Low">☕ Low</option>
            </select>

            <span className="meta-label">Category</span>
            <select
              className="meta-value-select"
              value={selectedTask.category || 'General'}
              onChange={(e) => updateTask(selectedTask._id, { category: e.target.value })}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Architecture">Architecture</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="General">General</option>
            </select>

            <span className="meta-label">Due Date</span>
            <input
              type="date"
              className="meta-value-select"
              value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                updateTask(selectedTask._id, {
                  dueDate: e.target.value ? new Date(e.target.value).toISOString() : null
                })
              }
            />
          </div>

          {/* Description / Notes */}
          <div className="drawer-desc-box">
            <span className="meta-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Description & Acceptance Criteria
            </span>
            <textarea
              className="drawer-desc-textarea"
              placeholder="Add detailed context, notes, links, or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescBlur}
            />
          </div>

          {/* Subtasks Checklist */}
          <div className="subtasks-section">
            <div className="subtasks-header">
              <span>Subtasks & Checklist</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {completedSubtasks} of {subtasks.length} done
              </span>
            </div>

            <div className="subtask-items-list">
              {subtasks.map((st) => (
                <div key={st.id} className="subtask-item-row">
                  <div className="subtask-item-left">
                    <button
                      type="button"
                      onClick={() => toggleSubtask(selectedTask._id, st.id)}
                      className={`status-circle-check ${st.completed ? 'checked' : ''}`}
                      aria-label={`Toggle subtask "${st.title}"`}
                    >
                      {st.completed && <Check size={10} strokeWidth={3} />}
                    </button>
                    <span className={`subtask-title-text ${st.completed ? 'completed' : ''}`}>
                      {st.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteSubtask(selectedTask._id, st.id)}
                    className="action-icon-btn"
                    title="Remove subtask"
                    style={{ width: '22px', height: '22px', border: 'none' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="add-subtask-row">
              <input
                type="text"
                className="add-subtask-input"
                placeholder="+ Add a subtask (press Enter)..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.8rem', flexShrink: 0 }}
                disabled={!newSubtaskText.trim()}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailDrawer;
