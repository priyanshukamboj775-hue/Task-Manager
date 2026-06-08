# Taskr — Personal Task Manager

> Studio Graphene Full Stack Assessment · Exercise 1

A clean, full-stack task manager built with **Node.js + Express** on the backend and **React + Vite** on the frontend. Users can create, view, update, and delete personal tasks, filter by status, search by title, and see overdue tasks highlighted — all persisted to a JSON file so data survives server restarts.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | https://task-manager-pi-orpin.vercel.app |
| Backend  | https://task-manager-api-wxea.onrender.com |

---

## Tech Stack

| Layer     | Choice | Why |
|-----------|--------|-----|
| Backend   | Node.js + Express | Minimal setup, straightforward routing, well-understood REST conventions |
| Frontend  | React 18 + Vite   | Fast HMR, functional components with hooks as required |
| Storage   | JSON file (`server/data/tasks.json`) | Persists across restarts without requiring a database setup |
| Styling   | Plain CSS with CSS custom properties | No build-time dependencies, easy to read and override |
| Testing   | Jest + Supertest   | Standard Node testing; Supertest lets us test HTTP routes cleanly |

---

## How to Run Locally

> Assumes only **Node.js 18+** and **npm** are installed.

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager

# 2. Install dependencies for both server and client
npm run install:all

# 3. Start the backend  (runs on http://localhost:4000)
npm run dev:server

# 4. In a second terminal, start the frontend  (runs on http://localhost:5173)
npm run dev:client

# 5. Open http://localhost:5173 in your browser
```

### Run tests
```bash
npm test
```

---

## API Documentation

Base URL (local): `http://localhost:4000`

### `GET /api/tasks`
Returns all tasks with optional filters.

| Query param | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `status`    | string | `active` \| `completed` (omit for all)   |
| `search`    | string | Case-insensitive title substring search  |

**Response 200**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Milk and eggs",
      "dueDate": "2025-06-15T00:00:00.000Z",
      "completed": false,
      "createdAt": "2025-06-08T10:00:00.000Z",
      "updatedAt": "2025-06-08T10:00:00.000Z"
    }
  ],
  "meta": { "total": 1, "activeCount": 1, "completedCount": 0 }
}
```

---

### `POST /api/tasks`
Create a new task.

**Request body**
```json
{ "title": "string (required)", "description": "string", "dueDate": "ISO date string" }
```
**Response 201** — the created task object.
**Response 400** — `{ "error": "title is required..." }`

---

### `GET /api/tasks/:id`
Returns a single task or **404**.

---

### `PUT /api/tasks/:id`
Full replacement update. Same body shape as POST, plus optional `"completed": boolean`.

**Response 200** — updated task.

---

### `PATCH /api/tasks/:id`
Partial update — send only the fields to change.

```json
{ "completed": true }
```
**Response 200** — updated task.

---

### `DELETE /api/tasks/:id`
**Response 204** — no body.
**Response 404** if not found.

---

## Project Structure

```
task-manager/
├── package.json          # Root convenience scripts (install:all, dev:server, dev:client)
│
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── index.js              # Express app setup, CORS, error handler
│   │   ├── routes/
│   │   │   └── tasks.js          # All /api/tasks routes
│   │   └── store/
│   │       └── taskStore.js      # In-memory array + JSON file persistence
│   ├── data/
│   │   └── tasks.json            # Auto-created; gitignored
│   └── tests/
│       └── tasks.test.js         # Jest + Supertest route tests
│
└── client/
    ├── package.json
    ├── vite.config.js            # Dev proxy → localhost:4000
    ├── index.html
    └── src/
        ├── main.jsx              # React root
        ├── App.jsx               # Top-level state, layout
        ├── index.css             # All styles (CSS custom properties)
        ├── api/
        │   └── tasks.js          # Fetch wrapper for all API calls
        ├── hooks/
        │   └── useTasks.js       # Data-fetching hook, CRUD actions
        └── components/
            ├── FilterBar.jsx     # Status tabs + search + counts
            ├── TaskForm.jsx      # Create / edit form
            ├── TaskItem.jsx      # Single task row (toggle, edit, delete)
            └── TaskList.jsx      # List + loading skeletons + empty state
```

---

## Deployment

### Backend → Render
1. Push to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Set **Root Directory** to `server`.
4. Build command: `npm install` · Start command: `node src/index.js`.
5. Add environment variable: `CLIENT_URL=https://your-app.vercel.app`.
6. Copy the service URL (e.g. `https://task-manager-api.onrender.com`).

### Frontend → Vercel
1. Import your repo on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Add environment variable: `VITE_API_URL=https://task-manager-api.onrender.com`.
4. Deploy.

---

## What Works
- Full CRUD: create, read, update, delete tasks
- Toggle complete / incomplete
- Filter by All / Active / Completed
- Search by title
- Overdue task highlighting
- Active vs completed task counts
- Empty state and loading skeletons
- Confirmation prompt before deletion
- JSON file persistence across server restarts
- 4 meaningful backend tests (Jest + Supertest)
- Responsive on mobile

## What I Would Add With More Time
- **Drag-and-drop reordering** (react-beautiful-dnd)
- **Keyboard shortcuts** (e.g. `n` to open new task form)
- **Optimistic UI updates** to avoid refetching after every mutation
- **Due-date reminder badge** in the browser tab title
- **SQLite** to replace the JSON file store for better concurrency

---

*Built for Studio Graphene — Node.js + React Programme Assessment*
