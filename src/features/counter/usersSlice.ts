/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { getUser, getUsers } from '../../api/users';

type UsersState = {
  users: User[];
  author: User | null;
  loading: {
    users: boolean;
    author: boolean;
  };
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  author: null,
  loading: {
    users: false,
    author: false,
  },
  error: null,
};

export const fetchUsersThunk = createAsyncThunk<User[]>(
  'users/fetch',
  async () => {
    return getUsers();
  },
);

export const fetchAuthorThunk = createAsyncThunk<User, number>(
  `users/fetchAuthor`,
  async id => {
    return getUser(id);
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setAuthor: (state, action: PayloadAction<User | null>) => {
      state.author = action.payload;
    },
  },

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
      })

      .addCase(fetchAuthorThunk.pending, state => {
        state.loading.author = true;
        state.error = null;
      })
      .addCase(fetchAuthorThunk.fulfilled, (state, action) => {
        state.author = action.payload;
        state.loading.author = false;
      })
      .addCase(fetchAuthorThunk.rejected, (state, action) => {
        state.loading.author = false;
        state.error = action.error.message || 'Failed to load author';
      });
  },
});

export default usersSlice.reducer;
export const { setAuthor } = usersSlice.actions;
