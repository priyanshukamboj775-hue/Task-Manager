import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const { tasks, meta, loading, error, createTask, updateTask, toggleTask, deleteTask } =
    useTasks(filter, search);

  const handleCreate = async (data) => {
    await createTask(data);
    setFormOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">✦</span>
            <span className="logo-text">Taskr</span>
          </div>
          <button className="btn btn-primary" onClick={() => setFormOpen((o) => !o)}>
            {formOpen ? 'Dismiss' : '+ New task'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {formOpen && (
          <section className="new-task-section">
            <TaskForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
          </section>
        )}

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          meta={meta}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
