import { useState } from 'react';
import TaskForm from './TaskForm';

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdate = async (updates) => {
    await onUpdate(task.id, { ...updates, completed: task.completed });
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const overdue = isOverdue(task);

  if (editing) {
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          initialValues={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--done' : ''}${overdue ? ' task-item--overdue' : ''}`}>
      <button
        className="task-checkbox"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? (
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : null}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          {task.dueDate && (
            <span className={`task-due${overdue ? ' task-due--overdue' : ''}`}>
              {overdue ? '⚠ Overdue · ' : '📅 '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={() => { setEditing(true); setConfirmDelete(false); }}
          aria-label="Edit task"
          title="Edit"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {confirmDelete ? (
          <div className="confirm-delete">
            <span>Delete?</span>
            <button className="btn-icon btn-icon--danger" onClick={handleDelete} title="Confirm delete">Yes</button>
            <button className="btn-icon" onClick={() => setConfirmDelete(false)} title="Cancel">No</button>
          </div>
        ) : (
          <button
            className="btn-icon btn-icon--danger"
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}
