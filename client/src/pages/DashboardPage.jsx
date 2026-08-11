import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import TaskColumn from '../components/TaskColumn';
import TaskFormModal from '../components/TaskFormModal';
import axiosClient from '../api/axiosClient';
import { useSocket } from '../hooks/useSocket';
import { fetchTasks, createTask, updateTask, deleteTask } from '../features/tasks/tasksSlice';

const COLUMNS = [
  { key: 'todo', title: 'To do' },
  { key: 'in-progress', title: 'In progress' },
  { key: 'done', title: 'Done' },
];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // One live Socket.io connection for the whole dashboard — see hooks/useSocket.js.
  useSocket();

  useEffect(() => {
    dispatch(fetchTasks());
    axiosClient.get('/users').then((res) => setUsers(res.data)).catch(() => setUsers([]));
  }, [dispatch]);

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSave(formData) {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, updates: formData })).then(unwrapOrThrow);
    } else {
      await dispatch(createTask(formData)).then(unwrapOrThrow);
    }
  }

  function handleStatusChange(taskId, newStatus) {
    dispatch(updateTask({ id: taskId, updates: { status: newStatus } }));
  }

  function handleDelete(taskId) {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      dispatch(deleteTask(taskId));
    }
  }

  return (
    <>
      <Navbar onNewTask={openCreateModal} />

      <main className="board-wrap">
        <p className={`board-status ${status === 'failed' ? 'is-error' : ''}`}>
          {status === 'loading' && 'Loading the board…'}
          {status === 'failed' && error}
          {status === 'succeeded' && `${tasks.length} task${tasks.length === 1 ? '' : 's'} on the board · live updates on`}
        </p>

        <div className="board">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.key}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.key)}
              onStatusChange={handleStatusChange}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {modalOpen && (
        <TaskFormModal
          task={editingTask}
          users={users}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

// Redux Toolkit thunks resolve even when rejected; this turns a rejected
// thunk back into a thrown error so the modal's try/catch can show it.
function unwrapOrThrow(action) {
  if (action.error) {
    throw new Error(action.payload || 'Request failed.');
  }
  return action;
}
