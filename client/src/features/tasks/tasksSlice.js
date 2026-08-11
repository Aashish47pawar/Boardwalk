import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

function extractErrorMessage(err) {
  return err.response?.data?.message || err.message || 'Something went wrong.';
}

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get('/tasks');
    return data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/tasks', taskData);
    return data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.put(`/tasks/${id}`, updates);
    return data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Called from the Socket.io listener (see hooks/useSocket.js). Adds a task
    // if it's new, or replaces it if a different client already has it —
    // either way the board stays in sync across every connected browser.
    upsertTaskFromSocket(state, action) {
      const incoming = action.payload;
      const index = state.items.findIndex((t) => t._id === incoming._id);
      if (index === -1) {
        state.items.unshift(incoming);
      } else {
        state.items[index] = incoming;
      }
    },
    removeTaskFromSocket(state, action) {
      state.items = state.items.filter((t) => t._id !== action.payload._id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // The server will also broadcast this over the socket, but updating
        // here immediately means the creator's own UI never has to wait for it.
        const exists = state.items.some((t) => t._id === action.payload._id);
        if (!exists) state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export const { upsertTaskFromSocket, removeTaskFromSocket } = tasksSlice.actions;
export default tasksSlice.reducer;
