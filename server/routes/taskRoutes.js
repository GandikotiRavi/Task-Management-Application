const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

// All task routes require authentication
router.use(verifyToken);

router.get('/', taskController.getTasks);
router.get('/stats', taskController.getTaskStats);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
