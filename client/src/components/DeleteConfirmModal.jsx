import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, task }) => {
  const { deleteTask } = useTasks();
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTask(task._id);
    setDeleting(false);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--priority-urgent)" />
            <h3 id="delete-dialog-title" style={{ fontSize: '1.1rem' }}>Delete Task</h3>
          </div>
          <button
            onClick={onClose}
            className="action-icon-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '12px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Are you sure you want to permanently delete this task?
          </p>
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            {task.title}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            id="confirm-delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
