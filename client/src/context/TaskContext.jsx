import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

const DEFAULT_SAMPLE_TASKS = [
  {
    _id: 'task_001',
    title: 'Official Browser-Style Chrome Interface',
    description: 'Design and build authentic browser window chrome, tabs, omnibox, bookmarks bar, and security indicators.',
    status: 'Completed',
    priority: 'Urgent',
    category: 'Design',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    subtasks: [
      { id: 'st_1', title: 'Window title bar & traffic lights controls', completed: true },
      { id: 'st_2', title: 'Curved browser tabs with audio/active state', completed: true },
      { id: 'st_3', title: 'Omnibox with live URL, SSL padlock, and search', completed: true },
      { id: 'st_4', title: 'Browser bookmarks bar for instant 1-click filters', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: 'task_002',
    title: 'Interactive Multi-Column Kanban Workflow',
    description: 'Smooth drag-and-drop task movements across Pending, In Progress, and Completed states with instant visual feedback.',
    status: 'In Progress',
    priority: 'High',
    category: 'Frontend',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    subtasks: [
      { id: 'st_5', title: 'HTML5 drag and drop data-transfer hooks', completed: true },
      { id: 'st_6', title: 'Column task counters and status color accents', completed: true },
      { id: 'st_7', title: 'Inline quick task card creation input', completed: false },
      { id: 'st_8', title: 'Confetti celebration trigger on task completion', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: 'task_003',
    title: 'Dual-Engine Real-Time & Offline Sync',
    description: 'Provide seamless Socket.IO live sync when server is active, with 100% resilient localStorage fallback.',
    status: 'In Progress',
    priority: 'High',
    category: 'Backend',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    subtasks: [
      { id: 'st_9', title: 'Socket.IO event broadcast on task mutations', completed: true },
      { id: 'st_10', title: 'Offline storage fallback engine in TaskContext', completed: true },
      { id: 'st_11', title: 'Connection health indicator in browser omnibox', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'task_004',
    title: 'Modern Linear-Grade Theme Tokens',
    description: 'Curated dark and light mode palette with glassmorphic cards, fluid typography, and crisp border accents.',
    status: 'Completed',
    priority: 'Medium',
    category: 'Design',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    subtasks: [
      { id: 'st_12', title: 'Define CSS variables for dark and light tokens', completed: true },
      { id: 'st_13', title: 'Browser omnibox and tab bar theme harmony', completed: true },
      { id: 'st_14', title: 'Persist theme selection in localStorage', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'task_005',
    title: 'Comprehensive Automated Integration Testing',
    description: 'Verify JWT authentication, task CRUD operations, subtasks state transitions, and server health endpoints.',
    status: 'Pending',
    priority: 'Medium',
    category: 'Testing',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    subtasks: [
      { id: 'st_15', title: 'Verify /api/health and /api/auth/demo', completed: false },
      { id: 'st_16', title: 'Verify task creation and subtask updates', completed: false },
      { id: 'st_17', title: 'Verify delete confirmation flow', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'task_006',
    title: 'Slide-Over Task Inspector & Subtasks Checklist',
    description: 'Inspect task metadata, update descriptions in place, track checklist items, and review activity history.',
    status: 'Pending',
    priority: 'Low',
    category: 'Frontend',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    subtasks: [
      { id: 'st_18', title: 'Side drawer transition with backdrop blur', completed: false },
      { id: 'st_19', title: 'Interactive subtask item toggles and deletion', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user, isOffline } = useAuth();

  // Load initial tasks from localStorage or defaults
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SAMPLE_TASKS;
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });

  const [loading, setLoading] = useState(false);

  // Active Browser Tab ('board' | 'list' | 'analytics' | 'urgent')
  const [activeBrowserTab, setActiveBrowserTab] = useState('board');

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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899']
      });
    } catch (e) {}
  }, []);

  // Calculate stats from a task array
  const calculateStats = useCallback((taskList) => {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === 'Completed').length;
    const inProgress = taskList.filter((t) => t.status === 'In Progress').length;
    const pending = taskList.filter((t) => t.status === 'Pending').length;
    const now = new Date();
    const overdue = taskList.filter((t) => {
      if (t.status === 'Completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < now;
    }).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, pending, overdue, completionRate };
  }, []);

  // Sync tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      setStats(calculateStats(tasks));
    } catch (e) {}
  }, [tasks, calculateStats]);

  // Fetch Tasks from API with automatic local fallback
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
      if (res.data?.success && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);

        setSelectedTask((current) => {
          if (!current) return null;
          const fresh = res.data.tasks.find((t) => t._id === current._id);
          return fresh || null;
        });
      }
    } catch (err) {
      // Backend unavailable: operate from localStorage
      console.warn('[TaskFlow] Server unavailable, reading from local workspace.');
      try {
        const saved = localStorage.getItem('taskflow_tasks');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTasks(parsed);
          }
        }
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filterStatus, filterPriority, filterCategory, searchQuery, sortBy, setSelectedTask]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/tasks/stats');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setStats(calculateStats(tasks));
    }
  }, [isAuthenticated, tasks, calculateStats]);

  // Create Task
  const createTask = async (taskData) => {
    const newTaskObj = {
      _id: 'task_' + Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'General',
      dueDate: taskData.dueDate || null,
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString()
    };

    try {
      const res = await api.post('/tasks', taskData);
      if (res.data?.success) {
        addToast('Task created successfully!', 'success');
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      console.warn('[TaskFlow] Server offline, saving task to local store.');
    }

    // Local fallback creation
    setTasks((prev) => [newTaskObj, ...prev]);
    addToast('Task created (Local Workspace)', 'success');
    return { success: true, task: newTaskObj };
  };

  // Update Task
  const updateTask = async (id, updates) => {
    if (updates.status === 'Completed') {
      triggerConfetti();
    }

    try {
      const res = await api.put(`/tasks/${id}`, updates);
      if (res.data?.success) {
        addToast('Task updated', 'success');
        fetchTasks();
        fetchStats();

        setSelectedTask((current) => {
          if (current && current._id === id) {
            return res.data.task;
          }
          return current;
        });

        return { success: true, task: res.data.task };
      }
    } catch (err) {
      console.warn('[TaskFlow] Server offline, updating task in local store.');
    }

    // Local fallback update
    setTasks((prev) => {
      const updatedList = prev.map((t) => (t._id === id ? { ...t, ...updates } : t));
      return updatedList;
    });

    setSelectedTask((current) => {
      if (current && current._id === id) {
        return { ...current, ...updates };
      }
      return current;
    });

    addToast('Task updated (Local Workspace)', 'success');
    return { success: true };
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data?.success) {
        addToast('Task removed', 'info');
        setSelectedTask((current) => (current && current._id === id ? null : current));
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.warn('[TaskFlow] Server offline, deleting task from local store.');
    }

    // Local fallback delete
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setSelectedTask((current) => (current && current._id === id ? null : current));
    addToast('Task removed (Local Workspace)', 'info');
    return { success: true };
  };

  // Subtask operations
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

  const moveTaskStatus = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

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

  // Filtered tasks computation
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
    if (filterCategory !== 'All' && task.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchCategory = task.category?.toLowerCase().includes(q);
      const matchSubtasks = task.subtasks?.some((st) => st.title?.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCategory && !matchSubtasks) return false;
    }
    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        allTasks: tasks,
        stats,
        loading,
        activeBrowserTab,
        setActiveBrowserTab,
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
