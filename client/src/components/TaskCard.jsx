const STATUS_OPTIONS = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const dueDate = formatDueDate(task.dueDate);

  return (
    <div className="task-card">
      <span className={`pin pin-${task.priority}`} aria-hidden="true" />

      <h3>{task.title}</h3>
      {task.description && <p className="desc">{task.description}</p>}

      <div className="task-meta">
        <span>{task.priority} priority</span>
        {dueDate && <span>Due {dueDate}</span>}
        <span>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
      </div>

      <div className="task-actions">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          aria-label={`Status for ${task.title}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div>
          <button type="button" className="task-icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
            Edit
          </button>
          <button
            type="button"
            className="task-icon-btn"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
