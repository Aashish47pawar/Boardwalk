import Task from '../models/Task.js';

const POPULATE_FIELDS = [
  { path: 'assignedTo', select: 'name email' },
  { path: 'createdBy', select: 'name email' },
];

// GET /api/tasks — every authenticated user sees the same shared board.
export async function getTasks(req, res) {
  try {
    const tasks = await Task.find().populate(POPULATE_FIELDS).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch tasks.', error: err.message });
  }
}

// GET /api/tasks/:id
export async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id).populate(POPULATE_FIELDS);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch task.', error: err.message });
  }
}

// POST /api/tasks
export async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    const populated = await task.populate(POPULATE_FIELDS);

    // Broadcast to every connected client so everyone's board updates instantly —
    // this is what makes task tracking "real-time" rather than just CRUD-on-refresh.
    req.app.get('io').emit('task:created', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Could not create task.', error: err.message });
  }
}

// PUT /api/tasks/:id
export async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const editableFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
    editableFields.forEach((field) => {
      if (field in req.body) task[field] = req.body[field];
    });

    await task.save();
    const populated = await task.populate(POPULATE_FIELDS);

    req.app.get('io').emit('task:updated', populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Could not update task.', error: err.message });
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    await task.deleteOne();

    req.app.get('io').emit('task:deleted', { _id: req.params.id });

    res.json({ message: 'Task deleted.', _id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete task.', error: err.message });
  }
}
