/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { getUser } from '../../api/users';

type AuthorState = {
  author: User | null;
  loading: {
    author: boolean;
  };
  error: string | null;
};

const initialState: AuthorState = {
  author: null,
  loading: {
    author: false,
  },
  error: null,
};

export const fetchAuthorThunk = createAsyncThunk<User, number>(
  `users/fetchAuthor`,
  async id => {
    return getUser(id);
  },
);

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    setAuthor: (state, action: PayloadAction<User | null>) => {
      state.author = action.payload;
    },
  },

  extraReducers: builder => {
    builder
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

export default authorSlice.reducer;
export const { setAuthor } = authorSlice.actions;
