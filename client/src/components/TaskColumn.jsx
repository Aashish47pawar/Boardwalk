import TaskCard from './TaskCard';

export default function TaskColumn({ title, tasks, onStatusChange, onEdit, onDelete }) {
  return (
    <section className="column">
      <div className="column-header">
        <h2>{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-cards">
        {tasks.length === 0 && <p className="column-empty">No tasks here yet.</p>}
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
