import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus, Check, X } from 'lucide-react';

const TaskKanban = () => {
  const { tasks, moveTaskStatus, createTask } = useTasks();

  const [activeInlineColumn, setActiveInlineColumn] = useState(null);
  const [inlineTitle, setInlineTitle] = useState('');

  const columns = [
    { id: 'Pending', label: 'Pending', dotClass: 'pending' },
    { id: 'In Progress', label: 'In Progress', dotClass: 'progress' },
    { id: 'Completed', label: 'Completed', dotClass: 'completed' }
  ];

  // Drag & Drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, targetStatus);
    }
  };

  // Submit quick inline task
  const handleInlineSubmit = async (status) => {
    if (!inlineTitle.trim()) {
      setActiveInlineColumn(null);
      return;
    }

    await createTask({
      title: inlineTitle.trim(),
      status,
      priority: 'Medium',
      category: 'General'
    });

    setInlineTitle('');
    setActiveInlineColumn(null);
  };

  return (
    <div className="board-container">
      <div className="kanban-grid" role="region" aria-label="Kanban Task Board">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.label);
          const isInlineOpen = activeInlineColumn === col.label;

          return (
            <section
              key={col.id}
              className="real-kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.label)}
              aria-label={`${col.label} column`}
            >
              {/* Column Header */}
              <div className="col-header">
                <div className="col-title-group">
                  <span className={`col-indicator-pill ${col.dotClass}`} />
                  <span>{col.label}</span>
                  <span className="col-count-bubble">{colTasks.length}</span>
                </div>

                <button
                  type="button"
                  className="col-add-btn"
                  onClick={() => {
                    setActiveInlineColumn(col.label);
                    setInlineTitle('');
                  }}
                  title={`Add task to ${col.label}`}
                  aria-label={`Add task to ${col.label}`}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Cards Stack */}
              <div className="column-cards-stack">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={handleDragStart}
                  />
                ))}

                {/* Inline Quick Add Form */}
                {isInlineOpen ? (
                  <div className="inline-add-form">
                    <input
                      type="text"
                      className="inline-add-input"
                      placeholder="What needs to be done? (press Enter)"
                      value={inlineTitle}
                      onChange={(e) => setInlineTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineSubmit(col.label);
                        if (e.key === 'Escape') setActiveInlineColumn(null);
                      }}
                      autoFocus
                    />
                    <div className="inline-add-actions">
                      <button
                        type="button"
                        onClick={() => setActiveInlineColumn(null)}
                        className="action-icon-btn"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <X size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInlineSubmit(col.label)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="inline-add-card"
                    onClick={() => {
                      setActiveInlineColumn(col.label);
                      setInlineTitle('');
                    }}
                  >
                    <Plus size={14} />
                    <span>Add card</span>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default TaskKanban;
