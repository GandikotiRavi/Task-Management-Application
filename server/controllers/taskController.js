const Task = require('../models/Task');
const { isUsingMongo, readStore, writeStore, initStore } = require('../config/db');

// Helper to emit real-time WebSocket events safely
const emitSocketEvent = (req, eventName, payload) => {
  const io = req.app.get('io');
  if (io) {
    io.emit(eventName, payload);
  }
};

// Priority weight helper for sorting
const priorityWeight = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

// GET /api/tasks (with search, filtering, and sorting)
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, category, search, sortBy } = req.query;

    if (isUsingMongo()) {
      const query = { userId };

      if (status && status !== 'All') {
        query.status = status;
      }

      if (priority && priority !== 'All') {
        query.priority = priority;
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { category: regex }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'dueDate_asc') sortOptions = { dueDate: 1 };
      else if (sortBy === 'dueDate_desc') sortOptions = { dueDate: -1 };
      else if (sortBy === 'createdAt_asc') sortOptions = { createdAt: 1 };
      else if (sortBy === 'title_asc') sortOptions = { title: 1 };

      let tasks = await Task.find(query).sort(sortOptions);

      if (sortBy === 'priority_desc') {
        tasks = tasks.sort(
          (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      }

      return res.status(200).json({ success: true, count: tasks.length, tasks });
    } else {
      // Fallback JSON Store
      const store = (await initStore()) || { tasks: [] };
      let tasks = store.tasks.filter((t) => t.userId === userId);

      if (status && status !== 'All') {
        tasks = tasks.filter((t) => t.status === status);
      }

      if (priority && priority !== 'All') {
        tasks = tasks.filter((t) => t.priority === priority);
      }

      if (category && category !== 'All') {
        tasks = tasks.filter((t) => t.category === category);
      }

      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        tasks = tasks.filter(
          (t) =>
            (t.title && t.title.toLowerCase().includes(term)) ||
            (t.description && t.description.toLowerCase().includes(term)) ||
            (t.category && t.category.toLowerCase().includes(term))
        );
      }

      // Sort
      tasks.sort((a, b) => {
        if (sortBy === 'dueDate_asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'dueDate_desc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === 'title_asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'priority_desc') {
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      return res.status(200).json({ success: true, count: tasks.length, tasks });
    }
  } catch (err) {
    console.error('getTasks error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve tasks.' });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, category, dueDate, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.'
      });
    }

    const newTaskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category ? category.trim() : 'General',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      userId
    };

    let createdTask;

    if (isUsingMongo()) {
      createdTask = await Task.create(newTaskData);
    } else {
      const store = (await initStore()) || { tasks: [] };
      createdTask = {
        _id: 'task_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        ...newTaskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.tasks.unshift(createdTask);
      writeStore(store);
    }

    emitSocketEvent(req, 'task_created', {
      task: createdTask,
      userName: req.user.name,
      action: 'created'
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: createdTask
    });
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const updates = req.body;

    if (updates.title && !updates.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty.'
      });
    }

    let updatedTask;

    if (isUsingMongo()) {
      const task = await Task.findOne({ _id: taskId, userId });
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }

      if (updates.title !== undefined) task.title = updates.title.trim();
      if (updates.description !== undefined) task.description = updates.description.trim();
      if (updates.status !== undefined) task.status = updates.status;
      if (updates.priority !== undefined) task.priority = updates.priority;
      if (updates.category !== undefined) task.category = updates.category.trim();
      if (updates.subtasks !== undefined) task.subtasks = updates.subtasks;
      if (updates.dueDate !== undefined) {
        task.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
      }

      updatedTask = await task.save();
    } else {
      const store = (await initStore()) || { tasks: [] };
      const index = store.tasks.findIndex((t) => t._id === taskId && t.userId === userId);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }

      const existing = store.tasks[index];
      updatedTask = {
        ...existing,
        title: updates.title !== undefined ? updates.title.trim() : existing.title,
        description: updates.description !== undefined ? updates.description.trim() : existing.description,
        status: updates.status !== undefined ? updates.status : existing.status,
        priority: updates.priority !== undefined ? updates.priority : existing.priority,
        category: updates.category !== undefined ? updates.category.trim() : existing.category,
        subtasks: updates.subtasks !== undefined ? updates.subtasks : (existing.subtasks || []),
        dueDate: updates.dueDate !== undefined ? (updates.dueDate ? new Date(updates.dueDate).toISOString() : null) : existing.dueDate,
        updatedAt: new Date().toISOString()
      };

      store.tasks[index] = updatedTask;
      writeStore(store);
    }

    emitSocketEvent(req, 'task_updated', {
      task: updatedTask,
      userName: req.user.name,
      action: 'updated'
    });

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask
    });
  } catch (err) {
    console.error('updateTask error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    if (isUsingMongo()) {
      const task = await Task.findOneAndDelete({ _id: taskId, userId });
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
    } else {
      const store = (await initStore()) || { tasks: [] };
      const index = store.tasks.findIndex((t) => t._id === taskId && t.userId === userId);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }

      store.tasks.splice(index, 1);
      writeStore(store);
    }

    emitSocketEvent(req, 'task_deleted', {
      taskId,
      userName: req.user.name,
      action: 'deleted'
    });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully!'
    });
  } catch (err) {
    console.error('deleteTask error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};

// GET /api/tasks/stats
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    let tasks = [];

    if (isUsingMongo()) {
      tasks = await Task.find({ userId });
    } else {
      const store = (await initStore()) || { tasks: [] };
      tasks = store.tasks.filter((t) => t.userId === userId);
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;

    const now = new Date();
    const overdue = tasks.filter(
      (t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        pending,
        overdue,
        completionRate
      }
    });
  } catch (err) {
    console.error('getTaskStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute stats.' });
  }
};
