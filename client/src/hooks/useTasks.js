import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/tasks';

export function useTasks(filter, search) {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, activeCount: 0, completedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks({ status: filter !== 'all' ? filter : '', search });
      setTasks(data.tasks);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    const created = await api.createTask(taskData);
    await fetchTasks();
    return created;
  };

  const updateTask = async (id, updates) => {
    await api.updateTask(id, updates);
    await fetchTasks();
  };

  const toggleTask = async (task) => {
    await api.patchTask(task.id, { completed: !task.completed });
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    await fetchTasks();
  };

  return { tasks, meta, loading, error, createTask, updateTask, toggleTask, deleteTask, refetch: fetchTasks };
}
