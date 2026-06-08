const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/tasks.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load tasks from file on startup
function loadTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load tasks from file, starting fresh:', err.message);
  }
  return [];
}

// Persist tasks to file
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save tasks to file:', err.message);
  }
}

let tasks = loadTasks();

const store = {
  getAll() {
    return [...tasks];
  },

  getById(id) {
    return tasks.find((t) => t.id === id) || null;
  },

  create(task) {
    tasks.unshift(task); // newest first
    saveTasks(tasks);
    return task;
  },

  update(id, updates) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
    return tasks[index];
  },

  remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    saveTasks(tasks);
    return true;
  },
};

module.exports = store;
