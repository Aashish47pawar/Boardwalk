import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { upsertTaskFromSocket, removeTaskFromSocket } from '../features/tasks/tasksSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Mounted once near the top of the app (see App.jsx). Opens a single Socket.io
// connection and forwards each event straight into Redux, so every component
// reading from the `tasks` slice re-renders automatically when anyone — on
// any browser — creates, edits, or deletes a task.
export function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('task:created', (task) => dispatch(upsertTaskFromSocket(task)));
    socket.on('task:updated', (task) => dispatch(upsertTaskFromSocket(task)));
    socket.on('task:deleted', (payload) => dispatch(removeTaskFromSocket(payload)));

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
}
