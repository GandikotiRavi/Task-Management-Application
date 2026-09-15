import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);

  // Filters & Views
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'kanban');

  // Selected task for side drawer
  const [selectedTask, setSelectedTaskState] = useState(null);
  const selectedTaskRef = useRef(null);

  const setSelectedTask = useCallback((taskOrUpdater) => {
    setSelectedTaskState((prev) => {
      const next = typeof taskOrUpdater === 'function' ? taskOrUpdater(prev) : taskOrUpdater;
      selectedTaskRef.current = next;
      return next;
    });
  }, []);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899']
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  // Fetch Tasks (NOTE: selectedTask is intentionally NOT in deps to prevent unnecessary refetches & race conditions)
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (filterPriority !== 'All') params.priority = filterPriority;
      if (filterCategory !== 'All') params.category = filterCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);

        // Safely update selectedTask ONLY IF currently open
        setSelectedTask((current) => {
          if (!current) return null;
          const fresh = res.data.tasks.find((t) => t._id === current._id);
          return fresh || null;
        });
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filterStatus, filterPriority, filterCategory, searchQuery, sortBy, setSelectedTask]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/tasks/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [isAuthenticated]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      if (res.data.success) {
        addToast('Task created successfully!', 'success');
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Update Task (Safe functional setter prevents resurrecting closed drawer)
  const updateTask = async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      if (res.data.success) {
        if (updates.status === 'Completed') {
          triggerConfetti();
        }
        addToast('Task updated', 'success');
        fetchTasks();
        fetchStats();

        // Update selected task only if drawer is still open on THIS task
        setSelectedTask((current) => {
          if (current && current._id === id) {
            return res.data.task;
          }
          return current;
        });

        return { success: true, task: res.data.task };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data.success) {
        addToast('Task removed', 'info');
        setSelectedTask((current) => (current && current._id === id ? null : current));
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Subtasks Operations
  const addSubtask = async (taskId, title) => {
    if (!title.trim()) return;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const newSubtask = {
      id: 'st_' + Date.now(),
      title: title.trim(),
      completed: false
    };

    const current = task.subtasks || [];
    const updatedSubtasks = [...current, newSubtask];
    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const current = task.subtasks || [];
    const updatedSubtasks = current.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
    const updates = { subtasks: updatedSubtasks };
    if (allDone && task.status !== 'Completed') {
      updates.status = 'Completed';
    }

    await updateTask(taskId, updates);
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const current = task.subtasks || [];
    const updatedSubtasks = current.filter((st) => st.id !== subtaskId);
    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // Quick move status
  const moveTaskStatus = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  // Quick toggle status
  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await updateTask(task._id, { status: nextStatus });
  };

  const changeViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
    }
  }, [isAuthenticated, fetchTasks, fetchStats]);

  // Real-time WebSocket Listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    const handleTaskCreated = (data) => {
      fetchTasks();
      fetchStats();
      if (data.userName && data.userName !== user?.name) {
        addToast(`${data.userName} added: "${data.task.title}"`, 'info');
      }
    };

    const handleTaskUpdated = (data) => {
      fetchTasks();
      fetchStats();
      if (data.userName && data.userName !== user?.name) {
        addToast(`${data.userName} updated: "${data.task.title}"`, 'info');
      }
    };

    const handleTaskDeleted = (data) => {
      fetchTasks();
      fetchStats();
      if (data.userName && data.userName !== user?.name) {
        addToast(`${data.userName} deleted a task`, 'info');
      }
    };

    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_deleted', handleTaskDeleted);

    return () => {
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_deleted', handleTaskDeleted);
    };
  }, [isAuthenticated, user?.name, fetchTasks, fetchStats, addToast]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        changeViewMode,
        selectedTask,
        setSelectedTask,
        toasts,
        addToast,
        removeToast,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        moveTaskStatus,
        toggleTaskStatus,
        triggerConfetti
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
