import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, error, onToggle, onUpdate, onDelete }) {
  if (loading) {
    return (
      <ul className="task-list task-list--skeleton">
        {[1, 2, 3].map((i) => (
          <li key={i} className="task-skeleton">
            <div className="skeleton skeleton-check" />
            <div className="skeleton-body">
              <div className="skeleton skeleton-line skeleton-line--long" />
              <div className="skeleton skeleton-line skeleton-line--short" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="empty-state empty-state--error">
        <span className="empty-icon">⚠</span>
        <p>Could not load tasks.</p>
        <small>{error}</small>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✦</span>
        <p>Nothing here yet.</p>
        <small>Add a task above to get started.</small>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
