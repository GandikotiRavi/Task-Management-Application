const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let isMongoConnected = false;
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial mock store data with realistic subtasks
const getInitialData = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  const demoUserId = 'demo_user_101';

  return {
    users: [
      {
        _id: demoUserId,
        name: 'Alex Johnson',
        email: 'demo@example.com',
        password: hashedPassword,
        createdAt: new Date().toISOString()
      }
    ],
    tasks: [
      {
        _id: 'task_001',
        title: 'Complete System Architecture Design',
        description: 'Design the full-stack architecture, database models, and WebSocket event pipelines for the task tracker.',
        status: 'Completed',
        priority: 'High',
        category: 'Architecture',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        subtasks: [
          { id: 'st_1', title: 'Draft ERD diagrams for Users and Tasks', completed: true },
          { id: 'st_2', title: 'Define JWT authentication flow', completed: true },
          { id: 'st_3', title: 'Setup Socket.IO broadcast schema', completed: true }
        ],
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        _id: 'task_002',
        title: 'Implement Interactive Kanban Board',
        description: 'Add drag & drop and column transitions for Pending, In Progress, and Completed states.',
        status: 'In Progress',
        priority: 'Urgent',
        category: 'Frontend',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        subtasks: [
          { id: 'st_4', title: 'Build column headers with task counters', completed: true },
          { id: 'st_5', title: 'Implement HTML5 drag & drop listeners', completed: true },
          { id: 'st_6', title: 'Add inline quick-card creation input', completed: false },
          { id: 'st_7', title: 'Trigger confetti on task completion', completed: true }
        ],
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        _id: 'task_003',
        title: 'Setup Real-time WebSocket Synchronization',
        description: 'Emit events when tasks are added, updated, or removed to keep multi-client dashboards synchronized.',
        status: 'In Progress',
        priority: 'High',
        category: 'Backend',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        subtasks: [
          { id: 'st_8', title: 'Configure Socket.io on Express server', completed: true },
          { id: 'st_9', title: 'Hook event broadcaster in task controller', completed: true },
          { id: 'st_10', title: 'Add client reconnection resilience', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        _id: 'task_004',
        title: 'Linear-Grade Dark & Light Theme System',
        description: 'Implement curated CSS variable tokens with glassmorphic cards and responsive mobile viewport layouts.',
        status: 'Completed',
        priority: 'Medium',
        category: 'Design',
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        subtasks: [
          { id: 'st_11', title: 'Select Linear-grade color palette tokens', completed: true },
          { id: 'st_12', title: 'Implement smooth theme toggle switch', completed: true }
        ],
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        _id: 'task_005',
        title: 'Write Comprehensive Unit & Integration Tests',
        description: 'Verify JWT authentication middleware, task filtering queries, and controller responses.',
        status: 'Pending',
        priority: 'Medium',
        category: 'Testing',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        subtasks: [
          { id: 'st_13', title: 'Unit test authController endpoints', completed: false },
          { id: 'st_14', title: 'Integration test task CRUD operations', completed: false },
          { id: 'st_15', title: 'Validate subtask update mutations', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'task_006',
        title: 'Slide-Over Task Detail Drawer & Activity Log',
        description: 'Create a rich side drawer to inspect tasks, manage subtasks, and add notes.',
        status: 'Pending',
        priority: 'Low',
        category: 'Frontend',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        subtasks: [
          { id: 'st_16', title: 'Design drawer layout with escape key dismiss', completed: false },
          { id: 'st_17', title: 'Support interactive subtask checkboxes', completed: false }
        ],
        userId: demoUserId,
        createdAt: new Date().toISOString()
      }
    ]
  };
};

// File Store Helpers
const readStore = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return null;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading JSON store:', err);
    return null;
  }
};

const writeStore = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON store:', err);
  }
};

const initStore = async () => {
  let data = readStore();
  if (!data || !data.users || data.users.length === 0 || !data.tasks[0]?.subtasks) {
    data = await getInitialData();
    writeStore(data);
  }
  return data;
};

// Connect to DB (Mongo or File Fallback)
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[Database] Connected to MongoDB at ${mongoURI}`);
  } catch (err) {
    isMongoConnected = false;
    console.log('[Database] MongoDB connection unavailable. Falling back to persistent local JSON store.');
    await initStore();
    console.log('[Database] Persistent store active at server/data/store.json');
  }
};

const isUsingMongo = () => isMongoConnected;

module.exports = {
  connectDB,
  isUsingMongo,
  readStore,
  writeStore,
  initStore
};
