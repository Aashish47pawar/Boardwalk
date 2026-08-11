import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Re-hydrate from localStorage on first load so a page refresh doesn't log the user out.
const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token') || null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

function extractErrorMessage(err) {
  return err.response?.data?.message || err.message || 'Something went wrong.';
}

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/auth/register', formData);
    return data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/auth/login', formData);
    return data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(
        (action) => [register.fulfilled.type, login.fulfilled.type].includes(action.type),
        (state, action) => {
          const { token, ...user } = action.payload;
          state.status = 'succeeded';
          state.user = user;
          state.token = token;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      )
      .addMatcher(
        (action) => [register.rejected.type, login.rejected.type].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
