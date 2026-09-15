import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, initialTask, defaultStatus = 'Pending' }) => {
  const { createTask, updateTask } = useTasks();

  const isEditing = !!initialTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const suggestedCategories = ['Frontend', 'Backend', 'Design', 'Architecture', 'Testing', 'Docs', 'General'];

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'Pending');
      setPriority(initialTask.priority || 'Medium');
      setCategory(initialTask.category || 'General');
      if (initialTask.dueDate) {
        setDueDate(new Date(initialTask.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'Pending');
      setPriority('Medium');
      setCategory('General');
      setDueDate('');
    }
    setError('');
  }, [initialTask, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    let res;
    if (isEditing) {
      res = await updateTask(initialTask._id, payload);
    } else {
      res = await createTask(payload);
    }

    setSubmitting(false);

    if (res.success) {
      onClose();
    } else if (res.message) {
      setError(res.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="task-modal-title">
            {isEditing ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="action-icon-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: 'var(--priority-urgent)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">
                Task Title <span style={{ color: 'var(--priority-urgent)' }}>*</span>
              </label>
              <input
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="e.g., Integrate Auth Middleware"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">
                Description
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                rows={3}
                placeholder="Add more context or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status-select">
                  Status
                </label>
                <select
                  id="task-status-select"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority-select">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">🔥 Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-category-input">
                Category / Tag
              </label>
              <input
                id="task-category-input"
                type="text"
                className="form-input"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="tag-pills">
                {suggestedCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`tag-pill-option ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-duedate-input">
                Target Due Date
              </label>
              <input
                id="task-duedate-input"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-task-btn"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
