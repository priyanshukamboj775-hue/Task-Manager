import { useState, useEffect } from 'react';

const today = () => new Date().toISOString().split('T')[0];

export default function TaskForm({ onSubmit, onCancel, initialValues = null }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate?.split('T')[0] || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setDueDate(initialValues.dueDate?.split('T')[0] || '');
    }
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), dueDate: dueDate || null });
      if (!initialValues) {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="task-title">Task title *</label>
        <input
          id="task-title"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          maxLength={200}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          placeholder="Any details? (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={1000}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-due">Due date</label>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : initialValues ? 'Save changes' : 'Add task'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
