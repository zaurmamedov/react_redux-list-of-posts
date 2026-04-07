/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { getUsers } from '../../api/users';

type UsersState = {
  users: User[];
  loading: {
    users: boolean;
  };
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: {
    users: false,
  },
  error: null,
};

export const fetchUsersThunk = createAsyncThunk<User[]>(
  'users/fetch',
  async () => {
    return getUsers();
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchUsersThunk.pending, state => {
        state.loading.users = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading.users = false;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.error.message || 'Failed to load users';
      });
  },
});

export default usersSlice.reducer;
