const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/taskStore');

const router = express.Router();

// Validate task body fields
function validateTask(body, requireTitle = true) {
  const errors = [];

  if (requireTitle && (!body.title || typeof body.title !== 'string' || !body.title.trim())) {
    errors.push('title is required and must be a non-empty string');
  }

  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    errors.push('dueDate must be a valid ISO date string');
  }

  return errors;
}

// GET /api/tasks — list all tasks, optional ?status filter & ?search query
router.get('/', (req, res) => {
  let tasks = store.getAll();

  const { status, search } = req.query;

  if (status === 'active') {
    tasks = tasks.filter((t) => !t.completed);
  } else if (status === 'completed') {
    tasks = tasks.filter((t) => t.completed);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  const total = store.getAll().length;
  const activeCount = store.getAll().filter((t) => !t.completed).length;
  const completedCount = total - activeCount;

  res.json({
    tasks,
    meta: { total, activeCount, completedCount },
  });
});

// POST /api/tasks — create a new task
router.post('/', (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  const task = {
    id: uuidv4(),
    title: req.body.title.trim(),
    description: req.body.description ? req.body.description.trim() : '',
    dueDate: req.body.dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = store.create(task);
  res.status(201).json(created);
});

// GET /api/tasks/:id — fetch a single task
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// PUT /api/tasks/:id — full update
router.put('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const errors = validateTask(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  const updated = store.update(req.params.id, {
    title: req.body.title.trim(),
    description: req.body.description ? req.body.description.trim() : '',
    dueDate: req.body.dueDate || null,
    completed: typeof req.body.completed === 'boolean' ? req.body.completed : task.completed,
    updatedAt: new Date().toISOString(),
  });

  res.json(updated);
});

// PATCH /api/tasks/:id — partial update (used for toggling complete)
router.patch('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const errors = validateTask(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  const allowedFields = ['title', 'description', 'dueDate', 'completed'];
  const updates = { updatedAt: new Date().toISOString() };

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  }

  const updated = store.update(req.params.id, updates);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const removed = store.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

module.exports = router;
