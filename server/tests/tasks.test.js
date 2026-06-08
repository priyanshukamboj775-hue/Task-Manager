const request = require('supertest');
const app = require('../src/index');

// Mock the store so tests don't write to disk
jest.mock('../src/store/taskStore', () => {
  let tasks = [];
  return {
    getAll: () => [...tasks],
    getById: (id) => tasks.find((t) => t.id === id) || null,
    create: (task) => { tasks.unshift(task); return task; },
    update: (id, updates) => {
      const i = tasks.findIndex((t) => t.id === id);
      if (i === -1) return null;
      tasks[i] = { ...tasks[i], ...updates };
      return tasks[i];
    },
    remove: (id) => {
      const i = tasks.findIndex((t) => t.id === id);
      if (i === -1) return false;
      tasks.splice(i, 1);
      return true;
    },
    _reset: () => { tasks = []; },
  };
});

const store = require('../src/store/taskStore');

beforeEach(() => store._reset());

describe('GET /api/tasks', () => {
  it('returns empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });
});

describe('POST /api/tasks', () => {
  it('creates a task with valid title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Buy groceries', description: 'Milk and eggs' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  it('rejects a task without a title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('toggles completion status', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'Test task' });
    const id = create.body.id;

    const res = await request(app).patch(`/api/tasks/${id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes an existing task', async () => {
    const create = await request(app).post('/api/tasks').send({ title: 'To delete' });
    const id = create.body.id;

    const del = await request(app).delete(`/api/tasks/${id}`);
    expect(del.status).toBe(204);

    const get = await request(app).get(`/api/tasks/${id}`);
    expect(get.status).toBe(404);
  });
});
