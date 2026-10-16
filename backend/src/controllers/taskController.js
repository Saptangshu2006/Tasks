import Task from '../models/Task.js';

// @desc    Get all tasks for current user with filtering, search, and sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, search, tag, dueFilter, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { user: req.user._id };

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Tag filter
    if (tag && tag.trim() !== '' && tag !== 'all') {
      query.tags = { $in: [tag.trim()] };
    }

    // Text search filter (title and description)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Due Date filter
    const now = new Date();
    if (dueFilter === 'overdue') {
      query.dueDate = { $lt: now, $ne: null };
      query.status = { $ne: 'completed' };
    } else if (dueFilter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (dueFilter === 'upcoming') {
      query.dueDate = { $gt: now };
    }

    // Sorting
    const sortField = ['dueDate', 'createdAt', 'title', 'priority'].includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;

    let sortOption = {};
    if (sortField === 'priority') {
      // Custom sorting or field sort
      sortOption = { priority: sortDirection, createdAt: -1 };
    } else {
      sortOption[sortField] = sortDirection;
    }

    const tasks = await Task.find(query).sort(sortOption);

    return res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching tasks.' });
  }
};

// @desc    Get dashboard statistics for tasks
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, pending, inProgress, completed, overdue, highPriority] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'pending' }),
      Task.countDocuments({ user: userId, status: 'in_progress' }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Task.countDocuments({
        user: userId,
        status: { $ne: 'completed' },
        dueDate: { $lt: now, $ne: null }
      }),
      Task.countDocuments({ user: userId, priority: 'high', status: { $ne: 'completed' } })
    ]);

    // Collect all distinct tags for this user for filter dropdowns
    const distinctTags = await Task.distinct('tags', { user: userId });

    return res.json({
      total,
      pending,
      inProgress,
      completed,
      overdue,
      highPriority,
      tags: distinctTags.filter(Boolean)
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching statistics.' });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Get task by id error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching task.' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: ['pending', 'in_progress', 'completed'].includes(status) ? status : 'pending',
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: parsedTags,
      user: req.user._id
    });

    const savedTask = await task.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: error.message || 'Server error creating task.' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty.' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (status !== undefined && ['pending', 'in_progress', 'completed'].includes(status)) {
      task.status = status;
    }

    if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        task.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        task.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating task.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    return res.json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ message: error.message || 'Server error deleting task.' });
  }
};
