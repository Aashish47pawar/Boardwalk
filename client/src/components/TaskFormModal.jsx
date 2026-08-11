import { useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
  assignedTo: '',
};

function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().slice(0, 10);
}

export default function TaskFormModal({ task, users, onClose, onSave }) {
  const isEditing = Boolean(task);

  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          dueDate: toDateInputValue(task.dueDate),
          assignedTo: task.assignedTo?._id || '',
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        ...form,
        dueDate: form.dueDate || null,
        assignedTo: form.assignedTo || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save the task.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit task' : 'New task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {isEditing && (
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange}>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="dueDate">Due date</label>
              <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="assignedTo">Assign to</label>
              <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
